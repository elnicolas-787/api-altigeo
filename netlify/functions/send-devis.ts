import { Handler } from "@netlify/functions";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler: Handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, error: "Method not allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing fields" }),
      };
    }

    // Email admin
    await resend.emails.send({
      from: "ALTIGÉO <contact@altigeo.mg>",
      to: "contact@altigeo.mg",
      subject: "Nouvelle demande de devis",
      html: `
        <h2>Nouvelle demande</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p>${message}</p>
      `,
    });

    // Email client
    await resend.emails.send({
      from: "ALTIGÉO <contact@altigeo.mg>",
      to: email,
      subject: "Confirmation de votre demande",
      html: `<p>Bonjour ${name}, nous avons bien reçu votre demande.</p>`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false }),
    };
  }
};
