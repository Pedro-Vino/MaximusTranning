 // arquivo: config/pool-conexoes.js
const mysql = require("mysql2/promise");

// Configuração do pool
const pool = mysql.createPool({
  host: "localhost",       // seu host do banco
  user: "root",     // seu usuário do banco
  password: "12345678",   // sua senha
  database: "maximus_db", // nome do banco
  waitForConnections: true,
  connectionLimit: 10,     // quantas conexões simultâneas o pool terá
  queueLimit: 0
});

module.exports = pool;