import { Resend } from 'resend';

export const config = {
  runtime: 'edge',
};

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const body = await req.json();
    const { company, role, process: processDetail, contact } = body;

    const { data, error } = await resend.emails.send({
      from: 'Opays Tech <onboarding@resend.dev>',
      to: ['lamsasfenelon@gmail.com'], // The user's email from the screenshot
      subject: `Nouveau Contact : ${company}`,
      html: `
        <h2>Nouvelle demande de consultance</h2>
        <p><strong>Entreprise :</strong> ${company}</p>
        <p><strong>Rôle :</strong> ${role}</p>
        <p><strong>Processus à optimiser :</strong> ${processDetail}</p>
        <p><strong>Contact (Email/Tel) :</strong> ${contact}</p>
      `,
    });

    if (error) {
      return new Response(JSON.stringify({ error }), { status: 400 });
    }

    return new Response(JSON.stringify({ data }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
