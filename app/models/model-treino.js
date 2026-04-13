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
  }

};

module.exports = TreinoModel;