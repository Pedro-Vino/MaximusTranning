const express = require('express');
const router = express.Router();
const admController = require('../controllers/admController');

const { verificarAdm } = admController;

router.get('/login', admController.exibirLogin);
router.post('/login', admController.realizarLogin);

router.get('/home', verificarAdm, admController.exibirHome);
router.get('/logout', admController.logout);

module.exports = router;