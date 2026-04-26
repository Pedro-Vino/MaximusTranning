const pool = require("../../config/pool-conexoes");

const TreinoHistoricoModel = {

  // verifica se já treinou hoje
  treinouHoje: async (alunoId) => {
    const hoje = new Date().toISOString().split('T')[0];
    const [rows] = await pool.query(
      "SELECT id FROM treino_historico WHERE aluno_id = ? AND data_treino = ?",
      [alunoId, hoje]
    );
    return rows.length > 0;
  },

  // registra treino concluído
  registrar: async (alunoId, treinoNome) => {
    const hoje = new Date().toISOString().split('T')[0];
    const [result] = await pool.query(
      "INSERT INTO treino_historico (aluno_id, treino_nome, data_treino) VALUES (?, ?, ?)",
      [alunoId, treinoNome, hoje]
    );
    return result.insertId;
  },

  // busca último treino feito
  ultimoTreino: async (alunoId) => {
    const [rows] = await pool.query(
      "SELECT * FROM treino_historico WHERE aluno_id = ? ORDER BY data_treino DESC LIMIT 1",
      [alunoId]
    );
    return rows[0] || null;
  },

  // conta sequência de dias
  sequenciaDias: async (alunoId) => {
    const [rows] = await pool.query(
      "SELECT data_treino FROM treino_historico WHERE aluno_id = ? ORDER BY data_treino DESC",
      [alunoId]
    );
    if (rows.length === 0) return 0;
    let sequencia = 0;
    const hoje = new Date();
    hoje.setHours(0,0,0,0);
    for (let i = 0; i < rows.length; i++) {
      const data = new Date(rows[i].data_treino);
      data.setHours(0,0,0,0);
      const diff = (hoje - data) / (1000 * 60 * 60 * 24);
      if (diff === i) sequencia++;
      else break;
    }
    return sequencia;
  }

};

module.exports = TreinoHistoricoModel;