// server.js
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint para enviar email
app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  // Log para debug
  console.log("Recebido:", req.body);

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Todos os campos são obrigatórios." });
  }

  try {
    // Configuração do Nodemailer
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true para 465, false para 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
    });

    // Testar conexão com o servidor SMTP
    transporter.verify((error, success) => {
      if (error) {
        console.log("Erro na verificação do transporter:", error);
      } else {
        console.log("Servidor SMTP pronto para enviar emails");
      }
    });

    // Envio do email
    const info = await transporter.sendMail({
      from: `"${name}" <${email}>`,
      to: process.env.EMAIL_USER,
      subject: "Novo contato do site 🎶",
      text: message,
      html: `<p><b>Nome:</b> ${name}</p>
             <p><b>Email:</b> ${email}</p>
             <p><b>Mensagem:</b></p>
             <p>${message}</p>`
    });

    console.log("Email enviado:", info.response);

    res.json({ ok: true, message: "Email enviado com sucesso!" });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).json({ ok: false, error: "Erro ao enviar email." });
  }
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
