import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.join(root, '..');
const opsDir = path.join(workspaceRoot, '06_ops');
const exportDir = path.join(opsDir, 'export');

function asciiNormalize(text) {
  const map = new Map([
    ['à', 'a'], ['â', 'a'], ['ä', 'a'], ['á', 'a'], ['ã', 'a'], ['å', 'a'],
    ['ç', 'c'],
    ['é', 'e'], ['è', 'e'], ['ê', 'e'], ['ë', 'e'],
    ['î', 'i'], ['ï', 'i'], ['ì', 'i'], ['í', 'i'],
    ['ô', 'o'], ['ö', 'o'], ['ò', 'o'], ['ó', 'o'], ['õ', 'o'],
    ['ù', 'u'], ['û', 'u'], ['ü', 'u'], ['ú', 'u'],
    ['ÿ', 'y'],
    ['À', 'A'], ['Â', 'A'], ['Ä', 'A'], ['Á', 'A'], ['Ã', 'A'], ['Å', 'A'],
    ['Ç', 'C'],
    ['É', 'E'], ['È', 'E'], ['Ê', 'E'], ['Ë', 'E'],
    ['Î', 'I'], ['Ï', 'I'], ['Ì', 'I'], ['Í', 'I'],
    ['Ô', 'O'], ['Ö', 'O'], ['Ò', 'O'], ['Ó', 'O'], ['Õ', 'O'],
    ['Ù', 'U'], ['Û', 'U'], ['Ü', 'U'], ['Ú', 'U'],
    ['Ÿ', 'Y'],
    ['œ', 'oe'], ['Œ', 'OE'], ['æ', 'ae'], ['Æ', 'AE'],
    ['’', "'"], ['“', '"'], ['”', '"'], ['–', '-'], ['—', '-'], ['«', '"'], ['»', '"'],
  ]);

  let out = '';
  for (const ch of text ?? '') {
    if (map.has(ch)) {
      out += map.get(ch);
    } else if (ch.charCodeAt(0) <= 126) {
      out += ch;
    } else {
      out += '?';
    }
  }
  return out;
}

function wrapText(text, width = 92) {
  const lines = [];
  const paragraphs = String(text).split('\n');
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }
    const words = paragraph.trim().split(/\s+/);
    let current = '';
    for (const word of words) {
      if (!current) {
        current = word;
      } else if ((current.length + 1 + word.length) <= width) {
        current += ` ${word}`;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function markdownToLines(sourceLines, title, subtitle) {
  const buffer = [];
  buffer.push('OPAYS TECH');
  buffer.push(title.toUpperCase());
  buffer.push(subtitle);
  buffer.push('');
  buffer.push('Version : Mai 2026');
  buffer.push('Statut : Dossier Investisseur / Partenaire');
  buffer.push('Acces : Confidentiel');
  buffer.push('');
  buffer.push('==============================================================================================');
  buffer.push('');

  for (const line of sourceLines) {
    if (/^\s*---\s*$/.test(line)) {
      buffer.push('');
      continue;
    }
    let match;
    if ((match = line.match(/^\s*#\s+(.+)$/))) {
      buffer.push('');
      buffer.push(match[1].trim().toUpperCase());
      buffer.push('');
      continue;
    }
    if ((match = line.match(/^\s*##\s+(.+)$/))) {
      buffer.push('');
      buffer.push(`## ${match[1].trim()}`);
      continue;
    }
    if ((match = line.match(/^\s*###\s+(.+)$/))) {
      buffer.push(`### ${match[1].trim()}`);
      continue;
    }
    if ((match = line.match(/^\s*>\s+(.+)$/))) {
      buffer.push(`NOTE: ${match[1].trim()}`);
      continue;
    }
    if ((match = line.match(/^\s*[-*]\s+(.+)$/))) {
      buffer.push(`- ${match[1].trim()}`);
      continue;
    }
    if ((match = line.match(/^\s*([0-9]+\.\s+.+)$/))) {
      buffer.push(match[1].trim());
      continue;
    }
    buffer.push(line.trimEnd());
  }

  const wrapped = [];
  for (const line of buffer) {
    if (!line.trim()) {
      wrapped.push('');
      continue;
    }
    if (line.startsWith('- ')) {
      const chunks = wrapText(line.slice(2), 86);
      chunks.forEach((chunk, index) => {
        wrapped.push(index === 0 ? `- ${chunk}` : `  ${chunk}`);
      });
      continue;
    }
    if (/^[0-9]+\.\s+/.test(line)) {
      const numMatch = line.match(/^([0-9]+\.\s+)(.+)$/);
      const prefix = numMatch[1];
      const restText = numMatch[2];
      const chunks = wrapText(restText, 86);
      chunks.forEach((chunk, index) => {
        wrapped.push(index === 0 ? `${prefix}${chunk}` : `  ${chunk}`);
      });
      continue;
    }
    wrapped.push(...wrapText(line, 94));
  }

  return wrapped.map(asciiNormalize);
}

function buildContentStream(lines) {
  const marginLeft = 50;
  const marginTop = 742;
  const lineHeight = 14;
  const text = [];
  text.push('BT');
  text.push('/F1 11 Tf');
  text.push(`1 0 0 1 ${marginLeft} ${marginTop} Tm`);
  text.push(`${lineHeight} TL`);
  for (const line of lines) {
    if (!line.trim()) {
      text.push('T*');
    } else {
      const escaped = line.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
      text.push(`(${escaped}) Tj`);
      text.push('T*');
    }
  }
  text.push('ET');
  return text.join('\n') + '\n';
}

function chunkLines(lines, size) {
  const pages = [];
  for (let i = 0; i < lines.length; i += size) {
    pages.push(lines.slice(i, i + size));
  }
  return pages;
}

async function buildPdf(markdownFilePath, pdfFilePath, title, subtitle) {
  console.log(`Building PDF for: ${path.basename(markdownFilePath)}...`);
  const markdown = await fs.readFile(markdownFilePath, 'utf8');
  const renderedLines = markdownToLines(markdown.split(/\r?\n/), title, subtitle);
  const pages = chunkLines(renderedLines, 46);

  const objects = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  objects.push(''); // pages object placeholder
  objects.push('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');

  const pageObjectIds = [];
  const contentObjectIds = [];
  for (let i = 0; i < pages.length; i++) {
    pageObjectIds.push(4 + i * 2);
    contentObjectIds.push(5 + i * 2);
    objects.push('');
    objects.push('');
  }

  objects[1] = `<< /Type /Pages /Kids [ ${pageObjectIds.map((id) => `${id} 0 R`).join(' ')} ] /Count ${pages.length} >>`;

  for (let i = 0; i < pages.length; i++) {
    const contentStream = buildContentStream(pages[i]);
    const contentObject = `<< /Length ${Buffer.byteLength(contentStream, 'ascii')} >>\nstream\n${contentStream}endstream`;
    objects[contentObjectIds[i] - 1] = contentObject;
    objects[pageObjectIds[i] - 1] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 3 0 R >> >> /Contents ${contentObjectIds[i]} 0 R >>`;
  }

  const parts = [];
  const header = Buffer.from('%PDF-1.4\n', 'ascii');
  parts.push(header);
  const offsets = [0];
  let currentOffset = header.length;

  for (let i = 0; i < objects.length; i++) {
    const obj = Buffer.from(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`, 'ascii');
    offsets.push(currentOffset);
    parts.push(obj);
    currentOffset += obj.length;
  }

  const xrefStart = currentOffset;
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i < offsets.length; i++) {
    xref += `${String(offsets[i]).padStart(10, '0')} 00000 n \n`;
  }
  xref += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
  const xrefBuf = Buffer.from(xref, 'ascii');
  parts.push(xrefBuf);

  await fs.mkdir(path.dirname(pdfFilePath), { recursive: true });
  await fs.writeFile(pdfFilePath, Buffer.concat(parts));
  console.log(`Generated: ${pdfFilePath}`);
  return pdfFilePath;
}

async function run() {
  const docs = [
    {
      md: path.join(opsDir, 'opays_investor_model_summary.md'),
      pdf: path.join(exportDir, 'opays_investor_model_summary.pdf'),
      title: 'Investor Model Summary',
      subtitle: 'Resume du modele economique, des hypotheses et du plan'
    },
    {
      md: path.join(opsDir, 'opays_investor_pitch_outline.md'),
      pdf: path.join(exportDir, 'opays_investor_pitch_outline.pdf'),
      title: 'Investor Pitch Outline',
      subtitle: 'Structure et plan detaille du deck de presentation'
    },
    {
      md: path.join(opsDir, 'opays_investor_talk_track.md'),
      pdf: path.join(exportDir, 'opays_investor_talk_track.pdf'),
      title: 'Talk Track Investisseur',
      subtitle: 'Script oral et reponses courtes aux questions sensibles'
    }
  ];

  for (const doc of docs) {
    try {
      await buildPdf(doc.md, doc.pdf, doc.title, doc.subtitle);
    } catch (err) {
      console.error(`Error compiling ${doc.title}:`, err);
    }
  }
  console.log('All PDFs built successfully!');
}

run();
