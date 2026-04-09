var express = require('express');
var router = express.Router();

const guestMiddleware = require('../helpers/guestMiddleware');
const alunosController = require('../controllers/alunosController');
const imcController = require('../controllers/imcController');

function verificar(fn) {
  return typeof fn === 'function' ? fn : (req, res) => res.sendStatus(500);
}

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
  res.render('pages/cadastro', {
    dados: { nome: "", email: "", senha: "" },
    erros: null,
    dadosNotificacao: null
  });
});

router.post('/cadastrar', alunosController.cadastrarAluno);

router.get('/login', verificar(alunosController.exibirLogin));
router.post('/login', verificar(alunosController.realizarLogin));

router.get('/logout', verificar(alunosController.logout));
router.post('/logout', verificar(alunosController.logout));

router.get('/imc', verificar(imcController.exibirImc));
router.post('/imc', verificar(imcController.realizarImc));

router.get('/recuperar-senha', (req, res) => {
  res.render('pages/recuperar-senha', {
    erros: null,
    dadosNotificacao: null
  });
});

router.post(
  '/recuperar-senha',
  verificar(alunosController.regrasValidacaoFormRecSenha),
  verificar(alunosController.recuperarSenha)
);

router.get('/reset-senha', verificar(alunosController.validarTokenNovaSenha));

router.get('/reset-senha-teste', (req, res) => {
  res.render('pages/resetar-senha', {
    erros: null,
    dadosNotificacao: null,
    usu_id: ""
  });
});

router.post(
  '/resetar-senha',
  verificar(alunosController.regrasValidacaoFormNovaSenha),
  verificar(alunosController.resetarSenha)
);

module.exports = router;