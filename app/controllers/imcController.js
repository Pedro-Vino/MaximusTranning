const imcModel = require('../models/model-imc')

const exibirImc = (req, res) => {
  res.render('pages/imc')
}

const realizarImc = async (req, res) => {
  const { peso, altura } = req.body

  try {
    const imc = await imcModel.salvarOuAtualizar(
      req.session.aluno_id,
      peso,
      altura
    )

    res.render('pages/imc', { imcBanco: imc })
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro ao salvar IMC')
  }
}

module.exports = { exibirImc, realizarImc }