const pool = require("../../config/pool-conexoes");

const UsuariotesteModel = {
  findAll: async () => {
    try {
      const query = `
        SELECT usu_id, usu_nome, usu_email, usu_peso, usu_altura 
        FROM usuarios
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      throw error;
    }
  },

  create: async ({ nome, email, senha, peso, altura }) => {
    try {
      const query = `
        INSERT INTO usuarios (usu_nome, usu_email, usu_senha, usu_peso, usu_altura)
        VALUES (?, ?, ?, ?, ?)
      `;

      const [result] = await pool.query(query, [
        nome,
        email,
        senha,
        peso,
        altura
      ]);

      return result.insertId;

    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

};

module.exports = UsuariotesteModel;