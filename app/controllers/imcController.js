const imcModel = require('../models/model-imc');

const exibirImc = (req, res) => {
  const id = req.session.aluno?.id || req.session.aluno_pendente;
  console.log("=== exibirImc ===");
  console.log("aluno:", req.session.aluno);
  console.log("aluno_pendente:", req.session.aluno_pendente);
  console.log("id:", id);
  if (!id) return res.redirect('/cadastro');
  res.render('pages/imc', { imcBanco: undefined });
};

const realizarImc = async (req, res) => {
  const { peso, altura } = req.body;
  const id = req.session.aluno?.id || req.session.aluno_pendente;
  console.log("=== realizarImc ===");
  console.log("aluno:", req.session.aluno);
  console.log("aluno_pendente:", req.session.aluno_pendente);
  console.log("id usado:", id);
  if (!id) return res.redirect('/cadastro');

  try {
    const imc = await imcModel.salvarOuAtualizar(id, peso, altura);
    res.render('pages/imc', { imcBanco: imc });
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar IMC');
  }
};

module.exports = { exibirImc, realizarImc };