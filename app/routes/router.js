var express = require('express');
var router = express.Router();
const guestMiddleware = require('../helpers/guestMiddleware');
const UsuariotesteController = require('../controllers/usuariotesteController');
const alunosController = require('../controllers/alunosController');


// AUTENTICACAO
function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    return next();
  }
  res.redirect("/login");
}



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





router.use((req, res, next) => {
  res.locals.aluno = req.session.aluno || null;
  next();
});

router.get('/cadastro', guestMiddleware, (req, res) => {
  res.render('pages/registro', 
  { "erros": null, "dados": {"email":"","senha":""},dadosNotificacao:"","retorno":null });
});

router.post('/cadastrar',
  alunosController.regrasValidacao, 
  alunosController.cadastrarAlunoNormal);

router.get(
  "/ativar-conta",
  async function (req, res) {
    alunosController.ativarConta(req, res);
  }
);

router.get("/login", (req, res) => {
  res.render("pages/login", {
  erro: null,  erros: null,  dados: { email: "", senha: "" }, dadosNotificacao:"",  retorno: null
});
});

router.post("/login",   alunosController.regrasValidacaoLogin, alunosController.autenticar);

// Rota de logout
router.get("/logout", alunosController.logout);
router.post("/logout", alunosController.logout);  

router.get("/recuperar-senha", 
  function(req, res){
    res.render("pages/recuperar-senha",
      { erros: null, dadosNotificacao: null });
});

router.post("/recuperar-senha",
  alunosController.regrasValidacaoFormRecSenha, 
  function(req, res){
    alunosController.recuperarSenha(req, res);
});

router.get("/reset-senha", 
  function(req, res){
    alunosController.validarTokenNovaSenha(req, res);
  });

  
router.get("/reset-senha-teste", 
  function(req, res){
      res.render("pages/resetar-senha",
      { erros: null, dadosNotificacao: null,"usu_id":"" });
  });
  
router.post("/resetar-senha", 
    alunosController.regrasValidacaoFormNovaSenha,
  function(req, res){
    alunosController.resetarSenha(req, res);
});





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