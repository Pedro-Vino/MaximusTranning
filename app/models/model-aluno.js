const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");

const AlunoModel = {

  findByEmail: async (email) => {
    const [rows] = await pool.query(
      "SELECT * FROM aluno WHERE alu_email = ?",
      [email]
    );
    return rows[0] || null;
  },

  create: async (data) => {
    const sql = `
      INSERT INTO aluno
      (alu_nome, alu_email, alu_senha)
      VALUES (?, ?, ?)
    `;
    const values = [data.nome, data.email, data.senha];
    const [result] = await pool.query(sql, values);
    return result.insertId;
  },

  // ← aqui estava o trecho duplicado, removido

  login: async (email) => {
    const [rows] = await pool.query(
      "SELECT * FROM aluno WHERE alu_email = ?",
      [email]
    );
    return rows[0] || null;
  },

  findId: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM aluno WHERE alu_id = ?",
      [id]
    );
    return rows[0] || null;
  },

  update: async (id, data) => {
    const fields = [];
    const values = [];

    if (data.nome) {
      fields.push("alu_nome = ?");
      values.push(data.nome);
    }
    if (data.email) {
      fields.push("alu_email = ?");
      values.push(data.email);
    }
    if (data.senha) {
      const hash = await bcrypt.hash(data.senha, 10);
      fields.push("alu_senha = ?");
      values.push(hash);
    }

    if (fields.length === 0) return false;

    const sql = `UPDATE aluno SET ${fields.join(", ")} WHERE alu_id = ?`;
    values.push(id);

    const [result] = await pool.query(sql, values);
    return result;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM aluno WHERE alu_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

  ativarConta: async (id) => {
    const [result] = await pool.query(
      "UPDATE aluno SET alu_status = 1 WHERE alu_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  },

};

module.exports = AlunoModel;