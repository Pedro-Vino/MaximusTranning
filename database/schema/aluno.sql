create database maximus_db;

USE maximus_db;

-- Se a tabela já existir:
DROP TABLE IF EXISTS aluno;


CREATE TABLE aluno (
    usu_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    alu_nome VARCHAR(100) NOT NULL,
    alu_email VARCHAR(100) NOT NULL UNIQUE,
    alu_senha VARCHAR(255) NOT NULL,
    alu_peso DECIMAL(5,2) NOT NULL,
    alu_altura DECIMAL(5,2) NOT NULL,
    alu_imc DECIMAL(5,2) NOT NULL
);