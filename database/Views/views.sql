--Vizualiçao do imc junto com nome 
CREATE VIEW registro AS
SELECT 
  a.id,
  a.nome,
  a.email,
  i.peso,
  i.altura,
  i.imc
FROM aluno a
JOIN imc i ON i.aluno_id = a.id;