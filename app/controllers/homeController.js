const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');
const TreinoModel = require('../models/model-treino');
const ProgressoModel = require('../models/model-progresso'); // ← trocado

const exibirHome = async (req, res) => {
  try {
    if (!req.session.aluno) {
      return res.render('pages/home', { aluno: null, treinos: [], imc: null });
    }

    const aluno = await AlunoModel.findByEmail(req.session.aluno.email);
    const imcDados = await imcModel.findByAluno(aluno.alu_id);

    let treinos = [];
    let categoria = null;

    if (imcDados) {
      const imcValor = Number(imcDados.imc);
      categoria = imcValor < 18.5 ? 'abaixo' : imcValor < 25 ? 'ideal' : 'acima';
      treinos = await TreinoModel.findByCategoria(categoria);
    }

    const treinouHoje = await ProgressoModel.treinouHoje(aluno.alu_id);
    const ultimoTreino = await ProgressoModel.ultimoTreino(aluno.alu_id);
    const sequencia = await ProgressoModel.sequenciaDias(aluno.alu_id);

    const seq = ['A', 'B', 'C'];
    const ultimoIdx = ultimoTreino ? seq.indexOf(ultimoTreino.treino_nome) : -1;

    // se já treinou hoje, mostra o treino de hoje mesmo (não avança)
    // se não treinou hoje, avança pro próximo
    const treinoHoje = treinouHoje
      ? seq[ultimoIdx]
      : seq[(ultimoIdx + 1) % 3];
    const treinoAtual = treinos.find(t => t.nome === treinoHoje) || treinos[0];

    return res.render('pages/home', {
      aluno: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        foto: aluno.alu_foto,
        imc: imcDados ? Number(imcDados.imc).toFixed(2) : null,
        categoria,
        sequencia
      },
      treinos,
      treinoAtual,
      treinouHoje,
      imc: imcDados
    });

  } catch (err) {
    console.error(err);
    return res.render('pages/home', { aluno: null, treinos: [], imc: null });
  }
};

const concluirTreino = async (req, res) => {
  try {
    const aluno = req.session.aluno; 
    const id = aluno?.alu_id || aluno?.id;
    if (!id) return res.redirect('/login');

    const treinouHoje = await ProgressoModel.treinouHoje(id);
    if (treinouHoje) return res.redirect('/');

    // passa categoria junto agora que a tabela exige
    const categoria = req.body.categoria;
    await ProgressoModel.registrar(id, req.body.treino_nome, categoria);
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.redirect('/');
  }
};

module.exports = { exibirHome, concluirTreino };