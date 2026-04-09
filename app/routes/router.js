var express = require('express');
var router = express.Router();

const guestMiddleware = require('../helpers/guestMiddleware');
const alunosController = require('../controllers/alunoscontroller');
const imcController = require('../controllers/imcController');

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

router.get('/proposta', (req, res) => {
  res.render('pages/nossaProposta');  
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

router.get('/imc', imcController.exibirImc)
router.post('/imc', imcController.realizarImc)

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


module.exports = router;