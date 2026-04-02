var express = require('express');
var router = express.Router();
const admController = require("../controllers/admController");
const db = require('../../config/pool-conexoes');

const USER = {
    id: "admMaximus",
    senha: "adm123456"
};

// ✅ HOME (usar só uma rota)
router.get('/home', async function(req, res){
    try {
        const [alunos] = await db.query('SELECT * FROM aluno');

        res.render('pages/adm/home', { alunos });

    } catch (err) {
        console.error(err);
        res.render('pages/adm/home', { alunos: [] });
    }
});

// ✅ LOGIN PAGE
router.get('/login', function(req, res){
    res.render('pages/adm/login', { erro: null });  
});

// ✅ LOGIN POST
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