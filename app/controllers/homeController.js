const db = require('../../config/pool-conexoes');
const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');


const exibirHome = async (req, res) => {
  try {
    if (!req.session.aluno) {
      return res.render('pages/home', { aluno: null, treinos: [], treinoAtual: null, treino_atual: null, dia: null });
    }

    const aluno = await AlunoModel.findByEmail(req.session.aluno.email);
    const imcDados = await imcModel.findByAluno(aluno.alu_id);

    let categoria = null;
    let treinoAtual = null;
    let treino_atual = null;
    let dia = null;

    if (imcDados) {
      const imcValor = Number(imcDados.imc);
      categoria = imcValor < 18.5 ? 'abaixo'
                : imcValor < 25   ? 'ideal'
                : 'acima';

      // qual treino vem agora
      const [[ultimo]] = await db.query(
        `SELECT treino_nome FROM progresso 
         WHERE aluno_id = ? 
         ORDER BY data_conclusao DESC LIMIT 1`,
        [aluno.alu_id]
      );

      treino_atual = !ultimo ? 'A' : { A: 'B', B: 'C', C: 'A' }[ultimo.treino_nome];

      const [[detalhes]] = await db.query(
        `SELECT * FROM treino WHERE nome = ? AND categoria = ?`,
        [treino_atual, categoria]
      );

      treinoAtual = detalhes || null;

      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) AS total FROM progresso WHERE aluno_id = ?`,
        [aluno.alu_id]
      );

      dia = total + 1;
    }

    return res.render('pages/home', {
      aluno: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        foto: aluno.alu_foto,
        imc: imcDados ? Number(imcDados.imc).toFixed(2) : null,
        categoria
      },
      treinos: treinoAtual ? [treinoAtual] : [],
      treinoAtual,
      treino_atual,
      dia
    });

  } catch (err) {
    console.error(err);
    return res.render('pages/home', { aluno: null, treinos: [], treinoAtual: null, treino_atual: null, dia: null });
  }
};

module.exports = { exibirHome };