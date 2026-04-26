const enviarContato = async (req, res) => {
    const { nome, email, assunto, mensagem } = req.body;
    try {
        const html = `
            <h2>Nova mensagem de contato</h2>
            <p><strong>Nome:</strong> ${nome}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Assunto:</strong> ${assunto}</p>
            <p><strong>Mensagem:</strong></p>
            <p>${mensagem}</p>
        `;
        const { enviarEmail } = require('../helpers/email');
        enviarEmail(process.env.EMAIL_USER, `Contato: ${assunto}`, null, html, () => {
            return res.render('pages/contato', {
                dadosNotificacao: {
                    titulo: "Mensagem enviada!",
                    mensagem: "Em breve entraremos em contato.",
                    tipo: "success"
                }
            });
        });
    } catch (err) {
        console.error(err);
        return res.render('pages/contato', {
            dadosNotificacao: {
                titulo: "Erro",
                mensagem: "Erro ao enviar mensagem",
                tipo: "error"
            }
        });
    }
};