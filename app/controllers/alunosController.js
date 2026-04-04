const UsuarioModel = require('../models/model-aluno');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const https = require("https");
const jwt = require("jsonwebtoken");

module.exports = {
    regrasValidacao: [
    body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
    body("email").isEmail().withMessage("Email inválido."),
    body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
    body("repsenha").custom((value, { req }) => {
    return value === req.body.senha;
    }).withMessage("Senhas estão diferentes"),
  ],
  

  cadastrarUsuarioNormal: async (req, res) => {
    
    const errors = validationResult(req);
        if(!errors.isEmpty()) {

            return res.render('pages/registro',{
                dados: req.body,
                erros: errors,
                dadosNotificacao: ""
            })
        }

    try {

      const {nome, email, senha, nasc } = req.body;

      if (email){
      const usuarioExistente = await UsuarioModel.findByEmail(email);
      if (usuarioExistente) {
       return res.render("pages/registro", {
        dados: req.body,
        erros: { errors: [{ path: 'email', msg: "Este email já está cadastrado" }] },
        dadosNotificacao: {
          titulo: "Falha ao cadastrar!",
          mensagem: "Este e-mail já está cadastrado!",
          tipo: "error",
        },
      });
    }


      }
     
      const senhaHash = await bcrypt.hash(senha, 10);
     
      const novoUsuario = await UsuarioModel.create({
        nome: nome,
        email: email,
        senha: senhaHash,
        foto: "imagens/usuarios/default_user.jpg",
        banner: "imagens/usuarios/default_background.jpg",
        status: 0,
        nasc: nasc
      });

      const token = jwt.sign(
        { userId: novoUsuario },
        process.env.SECRET_KEY
      );



      const html = require('../helpers/email-ativar-conta')(process.env.URL_BASE, token, nome);

      enviarEmail(email, "Cadastro no site SportAgora", null, html, (erro)=>{
        if (erro) {
        return res.render("pages/registro", {
            erros: [{ msg: "Erro ao enviar o e-mail. Tente novamente." }],
            dadosNotificacao: null,
            dados: req.body
        });
      }

        return res.render("pages/registro", {
          erros: null,
          dadosNotificacao: {
            titulo: "Cadastro realizado!",
            mensagem: "Novo usuário criado com sucesso!<br>"+
            "Enviamos um e-mail para a ativação de sua conta",
            tipo: "success",
          },
          dados: req.body
        });
      });
     
    } catch (e) {
      console.error(e);
      res.render("pages/registro", {
      dados: req.body,
      erros: { errors: [{ path: 'email', msg: "Ocorreu um erro ao criar a conta" }] },
      dadosNotificacao: "",
    });
    }
  },
    
  
};