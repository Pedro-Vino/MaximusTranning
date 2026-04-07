// 


// router novo 

var express = require('express');
var router = express.Router();

const guestMiddleware = require('../helpers/guestMiddleware');
const UsuariotesteController = require('../controllers/usuariotesteController');
const alunosController = require('../controllers/alunosController');

function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  res.redirect("/login");
}

// Disponibiliza aluno na view
router.use((req, res, next) => {
  res.locals.aluno = req.session.aluno || null;
  next();
});


router.get('/', (req, res) => {
  res.render('pages/home');  
});

router.get('/planos', (req, res) => {
  res.render('pages/planos');  
});

router.get('/compras', (req, res) => {
  res.render('pages/buy');
});


router.get('/cadastro', guestMiddleware, (req, res) => {
  res.render('pages/registro', { 
    erros: null, 
    dados: { email: "", senha: "" },
    dadosNotificacao: "",
    retorno: null 
  });
});

router.post(
  '/cadastrar',
  alunosController.regrasValidacao,
  alunosController.cadastrarAlunoNormal
);


router.get('/ativar-conta', alunosController.ativarConta);


router.get("/login", (req, res) => {
  res.render("pages/login", {
    erro: null,
    erros: null,
    dados: { email: "", senha: "" },
    dadosNotificacao: "",
    retorno: null
  });
});

router.post(
  "/login",
  alunosController.regrasValidacaoLogin,
  alunosController.autenticarAluno
);

router.get("/logout", alunosController.logout);
router.post("/logout", alunosController.logout);


router.get("/recuperar-senha", (req, res) => {
  res.render("pages/recuperar-senha", {
    erros: null,
    dadosNotificacao: null
  });
});

router.post(
  "/recuperar-senha",
  alunosController.regrasValidacaoFormRecSenha,
  alunosController.recuperarSenha
);

router.get("/reset-senha", alunosController.validarTokenNovaSenha);

router.get("/reset-senha-teste", (req, res) => {
  res.render("pages/resetar-senha", {
    erros: null,
    dadosNotificacao: null,
    usu_id: ""
  });
});

router.post(
  "/resetar-senha",
  alunosController.regrasValidacaoFormNovaSenha,
  alunosController.resetarSenha
);


router.get('/cadastro/teste', (req, res) => {
  res.render('pages/testesdoPedro');  
});

router.get('/cadastro/form', UsuariotesteController.formCadastro);
router.post('/cadastro', UsuariotesteController.cadastrar);


router.get('/usuarios', UsuariotesteController.listar);

router.get('/usuarios/view', (req, res) => {
  res.render('pages/usuarios');
});

module.exports = router;