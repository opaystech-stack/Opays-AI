import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(root, 'opays_launch_visuals.html');
const logoPath = path.join(root, 'opays_logo_embed.png');

const html = await fs.readFile(htmlPath, 'utf8');
const logo = await fs.readFile(logoPath);
const dataUri = `data:image/png;base64,${logo.toString('base64')}`;

const updated = html.replaceAll('../opays-hq/public/icon-logo.png', dataUri);
await fs.writeFile(htmlPath, updated);

console.log('embedded logo into', htmlPath);
