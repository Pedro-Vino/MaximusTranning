const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');
const bcrypt = require('bcryptjs');
const TreinoModel = require('../models/model-treino');
const ProgressoModel = require('../models/model-progresso');

const DIAS_SEMANA = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

function chaveDia(data) {
  const d = new Date(data);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

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

const exibirDashboard = async (req, res) => {
  try {
    const alunos = await AlunoModel.findAll();
    return res.render("pages/adm/dashboard", { alunos });
  } catch (err) {
    console.error(err);
    return res.render("pages/adm/dashboard", { alunos: [] });
  }
};

const logout = (req, res) => {
  req.session.destroy(() => res.redirect("/adm/login"));
};

const exibirAlunos = async (req, res) => {
  try {
    const alunos = await AlunoModel.findAll();
    return res.render("pages/adm/alunos", { alunos });
  } catch (err) {
    console.error(err);
    return res.render("pages/adm/alunos", { alunos: [] });
  }
};
const detalhesAluno = async (req, res) => {
  try {
    const id = req.params.id;
    const aluno = await AlunoModel.findId(id);
    if (!aluno) return res.redirect('/adm/alunos');

    const imc = await imcModel.findByAluno(id);
    const diasTreinados = await ProgressoModel.diasTreinadosUltimos7Dias(id);
    const totalConcluidos = await ProgressoModel.totalConcluidos(id);

    const chavesTreinados = new Set(diasTreinados.map(chaveDia));

    const hoje = new Date();
    const semana = [];
    for (let i = 6; i >= 0; i--) {
      const dia = new Date(hoje);
      dia.setDate(hoje.getDate() - i);
      semana.push({
        label: DIAS_SEMANA[dia.getDay()],
        dataFormatada: `${String(dia.getDate()).padStart(2, '0')}/${String(dia.getMonth() + 1).padStart(2, '0')}`,
        treinou: chavesTreinados.has(chaveDia(dia)),
        hoje: i === 0
      });
    }

    const diasTreinadosSemana = semana.filter(d => d.treinou).length;

    return res.render("pages/adm/aluno-detalhes", {
      aluno: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        imc: imc ? Number(imc.imc).toFixed(2) : null
      },
      semana,
      diasTreinadosSemana,
      totalConcluidos
    });
  } catch (err) {
    console.error(err);
    return res.redirect('/adm/alunos');
  }
};

const criarAluno = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;
    const senhaHash = await bcrypt.hash(senha, 10);
    await AlunoModel.create({ nome, email, senha: senhaHash });
    return res.redirect('/adm/alunos');
  } catch (err) {
    console.error(err);
    return res.redirect('/adm/alunos');
  }
};
const editarAluno = async (req, res) => {
  try {
    const { alu_id, nome, email, senha, status } = req.body;
    const dados = { nome, email };
    if (senha && senha.trim() !== "") dados.senha = senha;
    if (status !== undefined) dados.status = status;
    await AlunoModel.update(alu_id, dados);
    return res.redirect('/adm/alunos');
  } catch (err) {
    console.error(err);
    return res.redirect('/adm/alunos');
  }
};

const exibirTreinos = async (req, res) => {
  try {
    const treinos = await TreinoModel.findAll();
    return res.render("pages/adm/treinos", { treinos });
  } catch (err) {
    console.error(err);
    return res.render("pages/adm/treinos", { treinos: [] });
  }
};

const criarTreino = async (req, res) => {
  try {
    const { nome, musculo, descricao, categoria } = req.body;
    await TreinoModel.create({ nome, musculo, descricao, categoria });
    return res.redirect('/adm/treinos');
  } catch (err) {
    console.error(err);
    return res.redirect('/adm/treinos');
  }
};

const editarTreino = async (req, res) => {
  try {
    const { id, nome, musculo, descricao, categoria } = req.body;
    await TreinoModel.update(id, { nome, musculo, descricao, categoria });
    return res.redirect('/adm/treinos');
  } catch (err) {
    console.error(err);
    return res.redirect('/adm/treinos');
  }
};

const deletarTreino = async (req, res) => {
  try {
    await TreinoModel.delete(req.body.id);
    return res.redirect('/adm/treinos');
  } catch (err) {
    console.error(err);
    return res.redirect('/adm/treinos');
  }
};

module.exports = {
  verificarAdm, exibirLogin, realizarLogin, exibirHome, logout,
  exibirAlunos, detalhesAluno, criarAluno, editarAluno, exibirDashboard,
  exibirTreinos, criarTreino, editarTreino, deletarTreino
};