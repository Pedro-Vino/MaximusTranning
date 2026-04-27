const pool = require("../../config/pool-conexoes");

const ProgressoModel = {

  registrar: async (alunoId, treinoNome, categoria) => {
    const [result] = await pool.query(
      "INSERT INTO progresso (aluno_id, treino_nome, categoria) VALUES (?, ?, ?)",
      [alunoId, treinoNome, categoria]
    );
    return result.insertId;
  },

  treinouHoje: async (alunoId) => {
    const [rows] = await pool.query(
      "SELECT id FROM progresso WHERE aluno_id = ? AND DATE(data_conclusao) = CURDATE()",
      [alunoId]
    );
    return rows.length > 0;
  },

  ultimoTreino: async (alunoId) => {
    const [rows] = await pool.query(
      "SELECT * FROM progresso WHERE aluno_id = ? ORDER BY data_conclusao DESC LIMIT 1",
      [alunoId]
    );
    return rows[0] || null;
  },

  sequenciaDias: async (alunoId) => {
    const [rows] = await pool.query(
      "SELECT DATE(data_conclusao) as data_treino FROM progresso WHERE aluno_id = ? ORDER BY data_conclusao DESC",
      [alunoId]
    );
    if (rows.length === 0) return 0;
    let sequencia = 0;
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    for (let i = 0; i < rows.length; i++) {
      const data = new Date(rows[i].data_treino);
      data.setHours(0, 0, 0, 0);
      const diff = (hoje - data) / (1000 * 60 * 60 * 24);
      if (diff === i) sequencia++;
      else break;
    }
    return sequencia;
  }

};

module.exports = ProgressoModel;