var express = require('express');
var router = express.Router();

const guestMiddleware = require('../helpers/guestMiddleware');

const alunosController = require('../controllers/alunosController');
const imcController = require('../controllers/imcController');
const homeController = require('../controllers/homeController');
const progressoController = require('../controllers/progressoController');

const upload = require('../helpers/upload');

const chatController = require('../controllers/chatController');

function verificar(fn) {
  return typeof fn === 'function'
    ? fn
    : (req, res) => res.sendStatus(500);
}

router.use((req, res, next) => {
  res.locals.aluno = req.session.aluno || null;
  res.locals.paginaAtual = req.path;
  next();
});

// HOME
router.get('/', homeController.exibirHome);
router.get('/home', homeController.exibirHome);

// PROPOSTA
router.get('/proposta', (req, res) => {
  res.render('pages/nossaProposta');
});

// SUPORTE
router.get('/suporte', (req, res) => {
  res.render('pages/suporte');
});

// CADASTRO
router.get('/cadastro', guestMiddleware, (req, res) => {

  res.render('pages/cadastro', {
    dados: {
      nome: "",
      email: "",
      senha: ""
    },
    erros: null,
    dadosNotificacao: null
  });

});

router.post('/cadastrar',
  verificar(alunosController.cadastrarAluno)
);

router.get('/ativar-conta',
  verificar(alunosController.ativarConta)
);

// LOGIN
router.get('/login',
  verificar(alunosController.exibirLogin)
);

router.post('/login',
  verificar(alunosController.realizarLogin)
);

// LOGOUT
router.get('/logout',
  verificar(alunosController.logout)
);

router.post('/logout',
  verificar(alunosController.logout)
);

// IMC
router.get('/imc',
  verificar(imcController.exibirImc)
);

router.post('/imc',
  verificar(imcController.realizarImc)
);

// AGUARDAR VERIFICAÇÃO
router.get('/aguardar-verificacao', (req, res) => {

  res.render('pages/aguardar-verificacao', {
    dadosNotificacao: null
  });

});

// AUTH
function authMiddleware(req, res, next) {

  if (!req.session.aluno) {
    return res.redirect('/login');
  }

  next();
}

// PERFIL
router.get('/perfil',
  authMiddleware,
  verificar(alunosController.carregarPerfil)
);

router.get('/editar-perfil',
  authMiddleware,
  verificar(alunosController.carregarEditarPerfil)
);

router.post('/salvar-perfil',
  authMiddleware,
  upload.single('foto'),
  verificar(alunosController.gravarPerfil)
);

// RECUPERAR SENHA
router.get('/recuperar-senha', (req, res) => {

  res.render('pages/recuperar-senha', {
    erros: null,
    dadosNotificacao: null
  });

});

router.post('/recuperar-senha',

  alunosController.regrasValidacaoFormRecSenha,

  verificar(alunosController.recuperarSenha)

);

router.post('/resetar-senha',

  alunosController.regrasValidacaoFormNovaSenha,

  verificar(alunosController.resetarSenha)

);

router.get('/reset-senha',
  verificar(alunosController.validarTokenNovaSenha)
);

router.post('/resetar-senha',

  verificar(alunosController.regrasValidacaoFormNovaSenha),

  verificar(alunosController.resetarSenha)

);

// CONTATO
router.get('/contato', (req, res) => {

  res.render('pages/contato', {
    dadosNotificacao: null
  });

});

router.post('/contato',
  verificar(alunosController.enviarContato)
);

// TREINO
router.post('/concluir-treino',

  authMiddleware,

  homeController.concluirTreino

);

// CHATBOT
router.post('/chat', chatController.enviarMensagem);

module.exports = router;