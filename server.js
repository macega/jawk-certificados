const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 80;

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Securely Serve Static Files (Only public folders)
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/robots.txt', (req, res) => {
    res.sendFile(path.join(__dirname, 'robots.txt'));
});

// API Endpoint to send contact email
app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Validate inputs
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Todos os campos (nome, e-mail e mensagem) são obrigatórios.' });
    }

    // Simple email format check
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ error: 'Por favor, insira um e-mail corporativo válido.' });
    }

    // SMTP Configuration from environment variables
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const contactReceiver = process.env.CONTACT_RECEIVER || 'contato@jawk.com.br';

    // Verify configuration
    if (!smtpHost || !smtpUser || !smtpPass) {
        console.error('Erro de Configuração: SMTP_HOST, SMTP_USER ou SMTP_PASS não estão configurados no arquivo .env.');
        return res.status(500).json({ error: 'O servidor de e-mail não está configurado. Entre em contato com o suporte.' });
    }

    // Create SMTP Transporter
    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465, // true for 465, false for other ports
        auth: {
            user: smtpUser,
            pass: smtpPass
        },
        tls: {
            rejectUnauthorized: false // Avoid issues with self-signed SSL certs
        }
    });

    // Define Email Options
    const mailOptions = {
        from: `"${name} (Contato Website)" <${smtpUser}>`, // Must match authenticated user for SMTP authorization
        to: contactReceiver,
        replyTo: email, // Direct reply to user who filled the form
        subject: `[Website JAWK] Novo contato de ${name}`,
        text: `Novo contato enviado pelo formulário do site:\n\nNome: ${name}\nE-mail: ${email}\nMensagem: ${message}`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #06b6d4 100%); padding: 24px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 24px;">Novo Lead de Contato</h2>
                    <p style="margin: 4px 0 0 0; font-size: 14px; color: #e2e8f0;">Recebido via formulário do site JAWK Certificados</p>
                </div>
                <div style="padding: 30px; background-color: #ffffff;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 120px;">Nome:</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold;">E-mail:</td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;"><a href="mailto:${email}" style="color: #06b6d4; text-decoration: none;">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; font-weight: bold; vertical-align: top;">Mensagem:</td>
                            <td style="padding: 10px 0; white-space: pre-line;">${message}</td>
                        </tr>
                    </table>
                </div>
                <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0;">
                    Este e-mail foi enviado automaticamente pelo servidor de hospedagem do site certificado.jawk.com.br.
                </div>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`E-mail de contato enviado com sucesso de ${email} para ${contactReceiver}`);
        return res.status(200).json({ message: 'Mensagem enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail via Nodemailer:', error);
        return res.status(500).json({ error: 'Houve uma falha interna no envio do e-mail. Tente novamente mais tarde.' });
    }
});

// Serve 404 for undefined routes
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Servidor rodando com sucesso na porta ${PORT}`);
});
