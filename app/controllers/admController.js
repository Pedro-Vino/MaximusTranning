const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');
const bcrypt = require('bcryptjs');

const ADM_USER = "admMaximus";
const ADM_SENHA = "adm123456";

const verificarAdm = (req, res, next) => {
  if (!req.session || !req.session.adm) {
    return res.redirect("/adm/login");
  }
  next();
};

const exibirLogin = (req, res) => {
  res.render("pages/adm/login", {
    erro: null,
    erros: null,
    dados: { id: "", senha: "" },
    retorno: null
  });
};

const realizarLogin = async (req, res) => {
  const { id, senha } = req.body;
  if (id === ADM_USER && senha === ADM_SENHA) {
    req.session.adm = { id };
    return res.redirect("/adm/home");
  }
  return res.render("pages/adm/login", {
    erro: "ID ou senha incorretos",
    erros: null,
    dados: { id, senha: "" },
    retorno: null
  });
};

const exibirHome = async (req, res) => {
  try {
    const alunos = await AlunoModel.findAll();
    return res.render("pages/adm/home", { alunos });
  } catch (err) {
    console.error(err);
    return res.render("pages/adm/home", { alunos: [] });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/adm/login"));
};

module.exports = { verificarAdm, exibirLogin, realizarLogin, exibirHome, logout };