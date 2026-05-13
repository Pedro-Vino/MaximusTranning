require("dotenv").config();
const nodemailer = require("nodemailer");

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
console.log(process.env.EMAIL_SERVICE);

const transporter = nodemailer.createTransport({
sevice:"gmail",
auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS,
 },
});

async function testarEmail() {
 try {
 await transporter.sendMail({
 from: process.env.EMAIL_USER,
 to: "gssilva1409@gmail.com",
 subject: "Teste Maximus",
 text: "Funcionando 🚀",
 });

 console.log("Email enviado com sucesso!");
 } catch (erro) {
 console.log("Erro ao enviar:");
 console.log(erro);
 }
}

testarEmail();

