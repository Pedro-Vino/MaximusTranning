const mysql = require("mysql2/promise");

// Configuração do pool
const pool = mysql.createPool({
  host: "localhost",        // host do banco
  user: "root",             // usuário do banco
  password: "12345678",     // senha
  database: "maximus_db",   // nome do banco
  waitForConnections: true, // ficar aguardando requisições (conexões)
  connectionLimit: 10,      // quantas conexões simultâneas o pool terá
  queueLimit: 0             // limite da fila de espera por conexões
});

module.exports = pool;