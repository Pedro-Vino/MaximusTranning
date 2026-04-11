CREATE DATABASE maximus_db;
USE maximus_db;

-- Tabela aluno
CREATE TABLE aluno (
  id INT AUTO_INCREMENT PRIMARY KEY,
  alu_nome VARCHAR(100),
  alu_email VARCHAR(100) UNIQUE,
  alu_senha VARCHAR(255),
  alu_status TINYINT DEFAULT 0,
  alu_foto VARCHAR(255) DEFAULT 'imagens/alunos/default_user.jpg',
  alu_nasc DATE NULL
);

-- Tabela imc
CREATE TABLE imc (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT,
  peso DECIMAL(5,2),
  altura DECIMAL(4,2),
  imc DECIMAL(5,2),
  FOREIGN KEY (aluno_id) REFERENCES aluno(alu_id)
);

-- View
CREATE VIEW registro AS
SELECT 
  a.alu_id,
  a.alu_nome,
  a.alu_email,
  i.peso,
  i.altura,
  i.imc
FROM aluno a
JOIN imc i ON i.aluno_id = a.alu_id;

-- Trigger
DELIMITER //
CREATE TRIGGER calcular_imc
BEFORE INSERT ON imc
FOR EACH ROW
BEGIN
  SET NEW.imc = NEW.peso / (NEW.altura * NEW.altura);
END //
DELIMITER ;



-- -----PARA RESETAR A TABELA
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE imc;
-- TRUNCATE TABLE aluno;
-- SET FOREIGN_KEY_CHECKS = 1;
