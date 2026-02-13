// api/send-devis.ts

import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend('re_BiXPu1RP_D2UkJyiPpKP6mpsixYMhSns4');

export default async function handler(req: any, res: any) {
  // CORS - Autorise localhost et votre domaine Vercel
  res.setHeader("Access-Control-Allow-Origin", "*"); 
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Méthode non autorisée" });

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "Champs obligatoires manquants" });
    }

    // 1. Envoi vers VOUS
    // IMPORTANT : Le 'from' DOIT être onboarding@resend.dev tant que votre domaine n'est pas vérifié
    await resend.emails.send({
      from: email,
      to: "onboarding@resend.dev",
      subject: `Devis de ${name}`,
      html: `
        <h2>Nouvelle demande</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email client:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    // 2. Envoi de confirmation au CLIENT
    // Note : Ici aussi, le 'from' doit être onboarding@resend.dev pour l'instant
    await resend.emails.send({
      from: "onboarding@resend.dev", 
      to: email,
      subject: "Confirmation de votre demande",
      html: `<p>Bonjour ${name}, nous avons bien reçu votre demande.</p>`,
    });

    return res.status(200).json({ success: true });

  } catch (error: any) {
    // Affiche l'erreur réelle dans les logs Vercel
    console.error("Erreur Resend détaillée:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Erreur serveur",
      details: error.message 
    });
  }
}
