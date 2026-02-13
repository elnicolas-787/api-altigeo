import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const resend = new Resend("re_BiXPu1RP_D2UkJyiPpKP6mpsixYMhSns4");

app.post("/send-devis", async (req, res) => {
  try {
    const { name, email, message } = req.body;

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

    await resend.emails.send({
      from: "ALTIGÉO <contact@altigeo.mg>",
      to: email,
      subject: "Confirmation de votre demande",
      html: `<p>Bonjour ${name}, nous avons bien reçu votre demande.</p>`,
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log("API running on port 5000");
});
