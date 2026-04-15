const pool = require("../../config/pool-conexoes");

const salvarOuAtualizar = async (alunoId, peso, altura) => {
  const alturaM = parseFloat(altura) / 100;
  const pesoNum = parseFloat(peso);
  
  const imc = (pesoNum / (alturaM * alturaM)).toFixed(2);

  const [existe] = await pool.query(
    'SELECT id FROM imc WHERE aluno_id = ?',
    [alunoId]
  );

  if (existe.length > 0) {
    await pool.query(
      'UPDATE imc SET peso = ?, altura = ?, imc = ? WHERE aluno_id = ?',
      [pesoNum, alturaM.toFixed(2), imc, alunoId]
    );
  } else {
    await pool.query(
      'INSERT INTO imc (aluno_id, peso, altura, imc) VALUES (?, ?, ?, ?)',
      [alunoId, pesoNum, alturaM.toFixed(2), imc]
    );
  }

  return imc;
};

const findByAluno = async (alunoId) => {
  const [rows] = await pool.query(
    'SELECT peso, altura, imc FROM imc WHERE aluno_id = ? ORDER BY id DESC LIMIT 1',
    [alunoId]
  );
  return rows[0] || null;
};

module.exports = { salvarOuAtualizar, findByAluno };