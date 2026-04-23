const db = require('../../config/pool-conexoes');

const concluirTreino = async (req, res) => {
  try {
    const aluno = req.session.aluno;
    console.log('sessão aluno:', aluno);

    const aluno_id = aluno.alu_id || aluno.id;
    const { treino_nome, categoria } = req.body;

    await db.query(
      `INSERT INTO progresso (aluno_id, treino_nome, categoria) VALUES (?, ?, ?)`,
      [aluno_id, treino_nome, categoria]
    );

    res.redirect('/home');
  } catch (err) {
    console.error(err);
    res.redirect('/home');
  }
};

module.exports = { concluirTreino };