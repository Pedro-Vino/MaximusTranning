--aluno
CREATE TABLE aluno (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  senha VARCHAR(255)
);

--imc
CREATE TABLE imc (
  id INT AUTO_INCREMENT PRIMARY KEY,
  aluno_id INT,
  peso DECIMAL(5,2),
  altura DECIMAL(4,2),
  imc DECIMAL(5,2),
  FOREIGN KEY (aluno_id) REFERENCES aluno(id)
);