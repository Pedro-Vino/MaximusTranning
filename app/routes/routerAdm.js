const express = require('express');
const router = express.Router();
const admController = require('../controllers/admController');
const { verificarAdm } = admController;

router.get('/login', admController.exibirLogin);
router.post('/login', admController.realizarLogin);
router.get('/logout', admController.logout);

router.get('/dashboard', verificarAdm, admController.exibirDashboard);
router.get('/home', verificarAdm, admController.exibirHome);
router.get('/alunos', verificarAdm, admController.exibirAlunos);
router.post('/alunos/criar', verificarAdm, admController.criarAluno);
router.post('/alunos/editar', verificarAdm, admController.editarAluno);

router.get('/treinos', verificarAdm, admController.exibirTreinos);
router.post('/treinos/criar', verificarAdm, admController.criarTreino);
router.post('/treinos/editar', verificarAdm, admController.editarTreino);
router.post('/treinos/deletar', verificarAdm, admController.deletarTreino);

module.exports = router;