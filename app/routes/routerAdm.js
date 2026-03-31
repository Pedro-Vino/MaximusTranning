var express = require('express');
var router = express.Router();
const admController = require("../controllers/admController");

const verificarAdm = admController.verificarAdm;

router.get('/home',verificarAdm, function(req,res){
    res.render('pages/adm/home');  
})

module.exports = router;