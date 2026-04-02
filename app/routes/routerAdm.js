var express = require('express');
var router = express.Router();
const admController = require("../controllers/admController");
const UsuariotesteController = require("../controllers/usuariotesteController");

const USER = {
    id: "admMaximus",
    senha: "adm123456"
};

// 🔹 Middleware para verificar se o usuário é admin
const verificarAdm = admController.verificarAdm;


router.get('/home', function(req,res){
    res.render('pages/adm/home');  
})

router.get('/login', function(req, res){
    res.render('pages/adm/login', { erro: null });  
});
// 🔹 Conexão com banco
const db = require('../../config/pool-conexoes');

// 🔹 Abrir formulário
router.get('/aluno', (req, res) => {
    res.render('pages/formulario');
});

// 🔹 Cadastrar aluno
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

// 🔥 LOGIN (JÁ CORRIGIDO COM BANCO)
router.post('/login', async (req, res) => {
    const { id, senha } = req.body;

    if (id === USER.id && senha === USER.senha) {
        try {
            const [alunos] = await db.query('SELECT * FROM aluno');

            res.render('pages/adm/home', { 
                usuario: id,
                alunos
            });

        } catch (err) {
            console.error(err);

            res.render('pages/adm/home', { 
                usuario: id,
                alunos: []
            });
        }

    } else {
        res.render('pages/adm/login', { erro: "ID ou senha incorretos" });
    }
});


module.exports = router;