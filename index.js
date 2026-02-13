import express from "express";
import cors from "cors";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:3000", "https://altigeo.mg"],
    methods: ["POST", "OPTIONS", "GET"],
  }),
);

app.use(express.json());

app.listen(5000, () => {
  console.log("API running on port 5000");
});
