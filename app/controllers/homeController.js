const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');
const TreinoModel = require('../models/model-treino');
const TreinoHistoricoModel = require('../models/model-treino-historico');

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

    const treinouHoje = await TreinoHistoricoModel.treinouHoje(aluno.alu_id);
    const ultimoTreino = await TreinoHistoricoModel.ultimoTreino(aluno.alu_id);
    const sequencia = await TreinoHistoricoModel.sequenciaDias(aluno.alu_id);

    // define qual treino mostrar hoje (rotação A→B→C)
    const seq = ['A', 'B', 'C'];
    const ultimoIdx = ultimoTreino ? seq.indexOf(ultimoTreino.treino_nome) : -1;
    const treinoHoje = seq[(ultimoIdx + 1) % 3];
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
    const id = req.session.aluno?.id;
    if (!id) return res.redirect('/login');

    const treinouHoje = await TreinoHistoricoModel.treinouHoje(id);
    if (treinouHoje) return res.redirect('/');

    await TreinoHistoricoModel.registrar(id, req.body.treino_nome);
    return res.redirect('/');
  } catch (err) {
    console.error(err);
    return res.redirect('/');
  }
};

module.exports = { exibirHome, concluirTreino };