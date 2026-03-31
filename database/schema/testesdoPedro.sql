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

--quem leu é viado