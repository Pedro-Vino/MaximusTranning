const express = require('express')
const router = express.Router()
const pool = require('../../config/pool_conexao')

const cadastroController = require('../controllers/cadastroController')
const imcController = require('../controllers/imcController')
const homeController = require('../controllers/homeController')
const loginController = require('../controllers/loginController')

router.get('/cadastro', cadastroController.exibirCadastro)
router.post('/cadastro', cadastroController.realizarCadastro)

router.get('/imc', imcController.exibirImc)
router.post('/imc', imcController.realizarImc)

router.get('/home', homeController.exibirHome)

router.get('/login', loginController.exibirLogin)
router.post('/login', loginController.realizarLogin)

router.get('/registro', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM registro')
  res.render('registro', { alunos: rows })
})

module.exports = router