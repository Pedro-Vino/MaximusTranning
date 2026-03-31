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

//teste do Lucas para funcionalidades do banco de dados

// 🔹 Conexão com banco
const db = require('../../config/pool-conexoes');

// 🔹 Abrir formulário
router.get('/aluno', (req, res) => {
    res.render('pages/formulario');
});

// 🔹 Cadastrar aluno (IMC via trigger)
router.post('/aluno', async (req, res) => {
    const { nome, email, senha, peso, altura } = req.body;

    const sql = `
        INSERT INTO aluno 
        (alu_nome, alu_email, alu_senha, alu_peso, alu_altura) 
        VALUES (?, ?, ?, ?, ?)
    `;

    try {
        await db.query(sql, [nome, email, senha, peso, altura]);
        res.send('Aluno cadastrado com IMC 😮‍🔥');
    } catch (err) {
        console.error(err);
        res.send('Erro ao cadastrar aluno');
    }
});

module.exports = router;