var express = require('express');
var router = express.Router();
const guestMiddleware = require('../helpers/guestMiddleware');
const UsuariotesteController = require('../controllers/usuariotesteController');
const alunosController = require('../controllers/alunosController');


// Rotas de páginas estáticas
router.get('/', function(req, res){
    res.render('pages/home');  
});

router.get('/planos', function(req, res){
    res.render('pages/planos');  
});

router.get('/compras', function(req, res){
    res.render('pages/buy');
});

router.get('/cadastro', guestMiddleware, (req, res) => {
  res.render('pages/registro', 
  { "erros": null, "dados": {"email":"","senha":""},dadosNotificacao:"","retorno":null });
});

router.post('/cadastrar',
  alunosController.regrasValidacao, 
  alunosController.cadastrarAlunoNormal);


// Rotas de cadastro
router.get('/cadastro/teste', function(req, res){
    res.render('pages/testesdoPedro');  
});

router.get('/cadastro/form', UsuariotesteController.formCadastro);

router.post('/cadastro', UsuariotesteController.cadastrar);

// Rotas de usuários
router.get('/usuarios', UsuariotesteController.listar);

router.get('/usuarios/view', function(req, res){
    res.render('pages/usuarios');
});


module.exports = router;