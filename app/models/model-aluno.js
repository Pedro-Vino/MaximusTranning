// models/model-usuario.js
const pool = require("../../config/pool-conexoes");
const moment = require("moment");
const bcrypt = require("bcryptjs");
 
const UsuarioModel = {
  // Regras de validação 
  // Buscar usuário por ID
  findId: async (id) => {
    try {
      const query = "SELECT * FROM alunos WHERE usu_id = ?";
      const [rows] = await pool.query(query, [id]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao buscar usuário por ID:", error);
      throw error;
    }
  },
 
  // Verificar se email já existe
  findByEmail: async (email) => {
    try {
      const query = "SELECT * FROM alunos WHERE usu_email = ?";
      const [rows] = await pool.query(query, [email]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      throw error;
    }
  },

  findByName: async (nome) => {
    try {
      const query = "SELECT * FROM alunos WHERE alu_nome = ?";
      const [rows] = await pool.query(query, [nome]);
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error("Erro ao verificar nome:", error);
      throw error;
    }
  },
 
  // Criar novo aluno
  create: async (userData) => {
    try {
      const { nome, email, senha, foto, banner, status } = userData;
 
      // Preparar os dados para inserção
      const data = {
        alu_nome : nome,
        alu_email:  email,
        alu_senha: senha, // Já deve estar com hash
        alu_foto:foto,
        alu_banner:banner,
        alu_status: status || 0, // Padrão para inativo
      };
 
      // Construir a query dinamicamente
      const fields = Object.keys(data).filter(key => data[key] !== null);
      const values = fields.map(field => data[field]);
      const placeholders = fields.map(() => '?').join(', ');
     
      const query = `INSERT INTO alunos (${fields.join(', ')}) VALUES (${placeholders})`;
     
      const [result] = await pool.query(query, values);
      return result.insertId;
    } catch (error) {
      console.error("Erro ao criar aluno:", error);
      throw error;
    }
  },
 
  // Atualizar usuário
  atualizar: async (id, userData) => {
    try {
      const { nome, email, telefone, plano, tipo, foto, banner, senha} = userData;
 
      const data = {
        alu_nome: nome,
        alu_email: email,
        alu_senha:senha,
        contato_id: telefone,
        plano_id : plano,
        tipo : tipo,
        alu_foto : foto,
        alu_banner : banner,
      };
 
      // Construir a query dinamicamente
      const updates = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([key, _]) => `${key} = ?`);
     
      const values = Object.entries(data)
        .filter(([_, value]) => value !== undefined)
        .map(([_, value]) => value);
     
      // Adicionar o ID no final dos valores
      values.push(id);
     
      const query = `UPDATE alunos SET ${updates.join(', ')} WHERE alu_id= ?`;
     
      const [result] = await pool.query(query, values);
      return result;
    } catch (error) {
      console.error("Erro ao atualizar aluno:", error);
      throw error;
    }
  },
 
  // Excluir usuário
  excluir: async (id) => {
    try {
      const query = "DELETE FROM alunos WHERE alu_id = ?";
      const [result] = await pool.query(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      throw error;
    }
  },
 
  // Alterar senha do usuário
  alterarSenha: async (id, novaSenha) => {
    try {
      // Hash da nova senha
      const senhaHash = await bcrypt.hash(novaSenha, 10);
     
      const query = "UPDATE alunos SET usu_senha = ? WHERE alu_id = ?";
      const [result] = await pool.query(query, [senhaHash, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },

  ativarConta: async (id) => {
    try {
     
      const query = "UPDATE alunos SET usu_status = ? WHERE alu_id = ?";
      const [result] = await pool.query(query, [1, id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },

  ativarPlano: async (id) => {
    try {
     
      const query = "UPDATE alunos SET tipo = ? WHERE alu_id = ?";
      const [result] = await pool.query(query, ['o', id]);
     
      return result.affectedRows > 0;
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      throw error;
    }
  },



};
 
module.exports = UsuarioModel;
 

 
 