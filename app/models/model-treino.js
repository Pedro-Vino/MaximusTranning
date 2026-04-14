const pool = require("../../config/pool-conexoes");

const TreinoModel = {

  findByCategoria: async (categoria) => {
    const [rows] = await pool.query(
      "SELECT * FROM treino WHERE categoria = ?",
      [categoria]
    );
    return rows;
  },

  findAll: async () => {
    const [rows] = await pool.query("SELECT * FROM treino");
    return rows;
  },
    create: async (data) => {
    const [result] = await pool.query(
      "INSERT INTO treino (nome, musculo, descricao, categoria) VALUES (?, ?, ?, ?)",
      [data.nome, data.musculo, data.descricao, data.categoria]
    );
    return result.insertId;
  },

  update: async (id, data) => {
    const [result] = await pool.query(
      "UPDATE treino SET nome=?, musculo=?, descricao=?, categoria=? WHERE id=?",
      [data.nome, data.musculo, data.descricao, data.categoria, id]
    );
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM treino WHERE id=?", [id]);
    return result.affectedRows > 0;
  },

};

module.exports = TreinoModel;