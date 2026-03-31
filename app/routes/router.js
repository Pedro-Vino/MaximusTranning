var express = require('express');
var router = express.Router();
const UsuariotesteController = require('../controllers/usuariotesteController');

// Rotas de páginas estáticas
router.get('/', function(req, res){
    res.render('pages/home');  
});

router.get('/login', function(req, res){
    res.render('pages/login');  
});

router.get('/planos', function(req, res){
    res.render('pages/planos');  
});

router.get('/compras', function(req, res){
    res.render('pages/buy');
});

// Rotas de cadastro
// Mantendo seu teste de view antiga
router.get('/cadastro', function(req, res){
    res.render('pages/testesdoPedro');  
});

// Agora rota oficial do controller para abrir formulário
router.get('/cadastro/form', UsuariotesteController.formCadastro);

// Rota de envio do formulário
router.post('/cadastro', UsuariotesteController.cadastrar);

// Rotas de usuários
// Controller oficial
router.get('/usuarios', UsuariotesteController.listar);

// Mantendo teste de view estática (opcional)
router.get('/usuarios/view', function(req, res){
    res.render('pages/usuarios');
});

module.exports = router;