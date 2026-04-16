const AlunoModel = require('../models/model-aluno');
const imcModel = require('../models/model-imc');
const TreinoModel = require('../models/model-treino');

const exibirHome = async (req, res) => {
  try {
    if (!req.session.aluno) {
      return res.render('pages/home', { aluno: null, treinos: [], imc: null });
    }

    console.log("sessão aluno:", req.session.aluno);
    const aluno = await AlunoModel.findByEmail(req.session.aluno.email);
    console.log("aluno encontrado:", aluno?.alu_id);
    const imcDados = await imcModel.findByAluno(aluno.alu_id);
    console.log("imc encontrado:", imcDados);
  } catch (err) {
    console.error("Erro ao exibir home:", err);
    return res.render('pages/home', { aluno: null, treinos: [], imc: null });
  }
  
  try {
    // se não está logado, renderiza home simples
    if (!req.session.aluno) {
      return res.render('pages/home', {
        aluno: null,
        treinos: [],
        imc: null
      });
    }

    const aluno = await AlunoModel.findByEmail(req.session.aluno.email);
    const imcDados = await imcModel.findByAluno(aluno.alu_id);

    let treinos = [];
    let categoria = null;

    if (imcDados) {
      const imcValor = Number(imcDados.imc);
      categoria = imcValor < 18.5 ? 'abaixo'
                : imcValor < 25   ? 'ideal'
                : 'acima';
      treinos = await TreinoModel.findByCategoria(categoria);
    }

    return res.render('pages/home', {
      aluno: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        foto: aluno.alu_foto,
        imc: imcDados ? Number(imcDados.imc).toFixed(2) : null,
        categoria
      },
      treinos,
      imc: imcDados
    });

  } catch (err) {
    console.error(err);
    return res.render('pages/home', {
      aluno: null,
      treinos: [],
      imc: null
    });
  }
};

module.exports = { exibirHome };