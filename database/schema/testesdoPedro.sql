--BANCO DE DADOS QUE TA SENDO USADO PARA TESTES DO PEDRO
--100% PROVISÓRIO, APENAS PARA TESTES, NÃO TEM NADA A VER COM O PROJETO FINAL
--leia linha 25!!!

create database maximus_db;
-- Primeiro seleciona o banco
USE maximus_db;
-- Se a tabela já existir:
DROP TABLE IF EXISTS usuarios;
-- Criar a tabela do zero
CREATE TABLE usuarios (
    usu_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    usu_nome VARCHAR(100) NOT NULL,
    usu_email VARCHAR(100) NOT NULL UNIQUE,
    usu_senha VARCHAR(255) NOT NULL
);

INSERT INTO usuarios (usu_nome, usu_email, usu_senha)
VALUES ('Teste', 'teste@email.com', 'senha_hash_aqui');

ALTER TABLE usuarios
ADD COLUMN usu_peso DECIMAL(5,2) AFTER usu_senha,
ADD COLUMN usu_altura DECIMAL(5,2) AFTER usu_peso;


CREATE TABLE IF NOT EXISTS alunos (
        alu_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
        alu_email VARCHAR(55) NOT NULL UNIQUE,
        alu_nome VARCHAR(30) NOT NULL,
        alu_senha VARCHAR(72) NOT NULL, -- VALOR ALTO PELA SENHA SER CRIPTOGRAFADA
        alu_nasc DATE,
        alu_foto VARCHAR(255) DEFAULT NULL,
        alu_banner VARCHAR(255) DEFAULT NULL,
        tipo ENUM('c', 'a') NOT NULL DEFAULT 'c',
        alu_status BOOLEAN DEFAULT 0
    );


--quem leu é viado