// api/send-devis.ts

import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend('re_BiXPu1RP_D2UkJyiPpKP6mpsixYMhSns4');

export default async function handler(req: any, res: any) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Méthode non autorisée" });

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) return res.status(400).json({ success: false, error: "Champs obligatoires manquants" });

    // Email vers l'entreprise
    await resend.emails.send({
      from: "ALTIGÉO <contact@altigeo.mg>",
      to: "contact@altigeo.mg",
      subject: "Nouvelle demande de devis",
      html: `<h2>Nouvelle demande</h2>
             <p><strong>Nom:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p>${message}</p>`,
    });

    // Email de confirmation client
    await resend.emails.send({
      from: "ALTIGÉO <contact@altigeo.mg>",
      to: email,
      subject: "Confirmation de votre demande",
      html: `<p>Bonjour ${name}, nous avons bien reçu votre demande.</p>`,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: "Erreur serveur" });
  }
}
