
const express = require('express');
const router = express.Router();
const admController = require("../controllers/admController");
// const alunosController = require("../controllers/alunosController");

const verificarAdm = admController.verificarAdm;

const USER = {
    id: "admMaximus",
    senha: "adm123456"
};

router.get("/login", (req, res) => {
  res.render("pages/adm/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" },  retorno: null
});
});

router.get('/home',verificarAdm, function(req,res){
    res.render('pages/adm/home');  
})


// //LOGIN
// router.get('/login', admController.loginPage);
// //POST
// router.post('/login', admController.login);

// // Página FORMULÁRIO DE ALUNO
// router.get('/aluno', admController.formAluno);
// // POST
// router.post('/aluno', admController.cadastrarAluno);

module.exports = router;