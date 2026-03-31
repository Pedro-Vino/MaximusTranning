var express = require('express');
var router = express.Router();

router.get('/', function(req,res){
    res.render('pages/home');  
})

router.get('/login', function(req,res){
    res.render('pages/login');  
})

router.get('/planos', function(req,res){
    res.render('pages/planos');  
})

router.get('/compras', function(req,res){
    res.render('pages/buy');
})

module.exports = router;