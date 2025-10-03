import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Todos os campos são obrigatórios." });
  }

  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER || "djsampacontacts@gmail.com",
        pass: process.env.EMAIL_PASS || "mghezbuvvgnbldnv"
      }
    });

    await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER || "djsampacontacts@gmail.com",
    subject: "Novo contato do site 🎶",
    text: message,
    html: `<p><b>Nome:</b> ${name}</p>
            <p><b>Email:</b> ${email}</p>
            <p><b>Mensagem:</b></p>
            <p>${message}</p>`
    });

    res.json({ ok: true, message: "Email enviado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: "Erro ao enviar email." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));