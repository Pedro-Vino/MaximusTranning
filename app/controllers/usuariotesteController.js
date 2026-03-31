const UsuarioModel = require("../models/model-usuarioteste");
const bcrypt = require("bcryptjs");

const UsuariotesteController = {

  // abrir formulário
  formCadastro: (req, res) => {
    res.render("cadastro"); // página com form
  },

  // salvar usuário
  cadastrar: async (req, res) => {
    try {
      // pegar todos os campos do form, incluindo peso e altura
      const { nome, email, senha, peso, altura } = req.body;

      // criptografar senha
      const senhaHash = await bcrypt.hash(senha, 10);

      // criar usuário no banco
      await UsuarioModel.create({
        nome,
        email,
        senha: senhaHash,
        peso,
        altura,
        foto: "default.jpg",
        banner: "default.jpg"
      });

      // depois de cadastrar, redireciona pra lista
      res.redirect("/usuarios");

    } catch (err) {
      console.error(err);
      res.send("Erro ao cadastrar");
    }
  },

  // listar usuários
  listar: async (req, res) => {
    try {
      const usuarios = await UsuarioModel.findAll();

      res.render("pages/usuarios", { usuarios });

    } catch (err) {
      console.error(err);
      res.send("Erro ao listar");
    }
  }
};

module.exports = UsuariotesteController;