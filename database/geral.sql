CREATE DATABASE maximus_db;
USE maximus_db;

DROP VIEW IF EXISTS registro;
DROP TABLE IF EXISTS imc;
DROP TABLE IF EXISTS aluno;
DROP TABLE IF EXISTS treino;

-- Tabela aluno
CREATE TABLE aluno (
  alu_id INT AUTO_INCREMENT PRIMARY KEY,
  alu_nome VARCHAR(100),
  alu_email VARCHAR(100) UNIQUE,
  alu_senha VARCHAR(255),
  alu_status TINYINT DEFAULT 0,
  alu_foto VARCHAR(255) DEFAULT 'imagens/alunos/default_user.png',
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

-- Tabela treino
CREATE TABLE treino (
  id INT AUTO_INCREMENT PRIMARY KEY,
  categoria ENUM('ideal', 'acima', 'abaixo') NOT NULL,
  nome ENUM('A', 'B', 'C') NOT NULL,
  musculo VARCHAR(100),
  descricao TEXT
);

-- Inserts treino
INSERT INTO treino (categoria, nome, musculo, descricao) VALUES
('ideal', 'A', 'Peito, Ombro e Tríceps', 'Supino reto 4x12, desenvolvimento com halteres 3x12, tríceps corda 3x15. Foco em hipertrofia com cargas moderadas e boa execução.'),
('ideal', 'B', 'Costas e Bíceps', 'Puxada frontal 4x12, remada curvada 3x12, rosca direta 3x15. Foco em desenvolvimento muscular equilibrado.'),
('ideal', 'C', 'Pernas e Abdômen', 'Agachamento 4x12, leg press 3x15, cadeira extensora 3x12, prancha 3x45s. Foco em força e definição.'),
('acima', 'A', 'Peito, Ombro e Tríceps', 'Supino reto 3x15, desenvolvimento leve 3x15, tríceps corda 3x20. Foco em queima calórica com menos carga e mais repetições.'),
('acima', 'B', 'Costas e Bíceps', 'Puxada frontal 3x15, remada baixa 3x15, rosca alternada 3x20. Foco em gasto energético e resistência muscular.'),
('acima', 'C', 'Pernas e Abdômen', 'Agachamento 4x15, caminhada na esteira 20min, abdominal 4x20, prancha 3x60s. Foco em emagrecimento.'),
('abaixo', 'A', 'Peito, Ombro e Tríceps', 'Supino reto 4x8, desenvolvimento com barra 4x8, tríceps francês 3x10. Foco em ganho de massa com cargas altas e baixas repetições.'),
('abaixo', 'B', 'Costas e Bíceps', 'Puxada frontal 4x8, remada curvada pesada 4x8, rosca scott 3x10. Foco em ganho de peso e volume muscular.'),
('abaixo', 'C', 'Pernas e Abdômen', 'Agachamento pesado 4x8, leg press 4x10, cadeira flexora 3x10, abdominal 3x15. Foco em ganho de massa e força.');

-- Trigger
DELIMITER //
CREATE TRIGGER calcular_imc
BEFORE INSERT ON imc
FOR EACH ROW
BEGIN
  SET NEW.imc = NEW.peso / (NEW.altura * NEW.altura);
END //
DELIMITER ;

-- View
CREATE VIEW registro AS
SELECT 
  a.alu_id AS id,
  a.alu_nome AS nome,
  a.alu_email AS email,
  i.peso,
  i.altura,
  i.imc,
  CASE 
    WHEN i.imc < 18.5 THEN 'abaixo'
    WHEN i.imc < 25 THEN 'ideal'
    ELSE 'acima'
  END AS categoria
FROM aluno a
JOIN imc i ON i.aluno_id = a.alu_id;
  

-- -----PARA RESETAR A TABELA
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE imc;
-- TRUNCATE TABLE aluno;
-- SET FOREIGN_KEY_CHECKS = 1;
