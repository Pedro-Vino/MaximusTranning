
const express = require('express');
const router = express.Router();
const admController = require("../controllers/admController");
const USER = {
    id: "admMaximus",
    senha: "adm123456"
};

// HOME
router.get('/home', admController.home);

//LOGIN
router.get('/login', admController.loginPage);
//POST
router.post('/login', admController.login);

// Página FORMULÁRIO DE ALUNO
router.get('/aluno', admController.formAluno);
// POST
router.post('/aluno', admController.cadastrarAluno);

module.exports = router;