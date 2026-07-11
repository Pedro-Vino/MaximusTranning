const imcModel = require('../models/model-imc');
const TreinoModel = require('../models/model-treino');
const ProgressoModel = require('../models/model-progresso');

// Mesma lógica usada na tela de exercícios (home logado) pra decidir
// qual é o treino do dia: se o aluno já treinou hoje, mantém o treino
// de hoje; senão avança pro próximo da sequência A -> B -> C -> A.
async function obterTreinoAtual(alunoId) {
  const imcDados = await imcModel.findByAluno(alunoId);
  if (!imcDados) {
    return { treinoAtual: null, categoria: null, treinouHoje: false };
  }

  const imcValor = Number(imcDados.imc);
  const categoria = imcValor < 18.5 ? 'abaixo' : imcValor < 25 ? 'ideal' : 'acima';
  const treinos = await TreinoModel.findByCategoria(categoria);

  const treinouHoje = await ProgressoModel.treinouHoje(alunoId);
  const ultimoTreino = await ProgressoModel.ultimoTreino(alunoId);

  const seq = ['A', 'B', 'C'];
  const ultimoIdx = ultimoTreino ? seq.indexOf(ultimoTreino.treino_nome) : -1;

  const treinoHoje = treinouHoje ? seq[ultimoIdx] : seq[(ultimoIdx + 1) % 3];
  const treinoAtual = treinos.find(t => t.nome === treinoHoje) || treinos[0] || null;

  return { treinoAtual, categoria, treinouHoje };
}

module.exports = { obterTreinoAtual };
