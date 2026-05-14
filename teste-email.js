const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "trainningmaximus@gmail.com",
    pass: "lhcjvdlzyjdznptz",
  },
});

const mailOptions = {
  from: "trainningmaximus@gmail.com",
  to: "gssilva1409@gmail.com",
  subject: "Teste",
  text: "Funcionando!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Email enviado:", info.response);
  }
});