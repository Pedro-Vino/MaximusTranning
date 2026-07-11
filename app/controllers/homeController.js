const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');
const ProgressoModel = require('../models/model-progresso'); // ← trocado
const { obterTreinoAtual } = require('../helpers/treinoAtual');

const exibirHome = async (req, res) => {
  try {
    if (!req.session.aluno) {
      return res.render('pages/home', { aluno: null, treinos: [], imc: null });
    }

    const aluno = await AlunoModel.findByEmail(req.session.aluno.email);
    const imcDados = await imcModel.findByAluno(aluno.alu_id);

    const { treinoAtual, categoria, treinouHoje } = await obterTreinoAtual(aluno.alu_id);
    const sequencia = await ProgressoModel.sequenciaDias(aluno.alu_id);

    return res.render('pages/home', {
      aluno: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        foto: aluno.alu_foto,
        imc: imcDados ? Number(imcDados.imc).toFixed(2) : null,
        categoria,
        sequencia
      },
      treinoAtual,
      treinouHoje,
      imc: imcDados
    });

  } catch (err) {
    console.error(err);
    return res.render('pages/home', { aluno: null, treinos: [], imc: null });
  }
};

const concluirTreino = async (req, res) => {
  try {
    const aluno = req.session.aluno; 
    const id = aluno?.alu_id || aluno?.id;
    if (!id) return res.redirect('/login');

    const treinouHoje = await ProgressoModel.treinouHoje(id);
    if (treinouHoje) return res.redirect('/');

    // passa categoria junto agora que a tabela exige
    const categoria = req.body.categoria;
    await ProgressoModel.registrar(id, req.body.treino_nome, categoria);
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.redirect('/');
  }
};

module.exports = { exibirHome, concluirTreino };