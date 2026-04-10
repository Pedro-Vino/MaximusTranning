const AlunoModel = require('../models/model-aluno');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../helpers/email");
const imcModel = require('../models/model-imc');

function classificarImc(imc) {
  if (imc < 18.5) return 'Abaixo do peso';
  if (imc < 25)   return 'Peso ideal';
  if (imc < 30)   return 'Sobrepeso';
  return 'Obesidade';
}

module.exports = {

  // regrasValidacao: [
  //   body("nome").optional().isLength({ min: 3, max: 30 }).withMessage("Nome inválido"),
  //   body("email").isEmail().withMessage("Email inválido"),
  //   body("senha").isLength({ min: 6 }).withMessage("Senha muito fraca"),
  //   body("repsenha").optional().custom((value, { req }) => value === req.body.senha)
  //     .withMessage("Senhas diferentes")
  // ],

  exibirLogin: (req, res) => {
    res.render('pages/login', {
      dados: { email: "", senha: "" },
      erros: null,
      erro: null,
      dadosNotificacao: null
    });
  },

  realizarLogin: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('pages/login', {
        dados: req.body,
        erros: errors,
        erro: null,
        dadosNotificacao: null
      });
    }

    const { email, senha } = req.body;

    try {
      const aluno = await AlunoModel.findByEmail(email);

      if (!aluno) {
        return res.render('pages/login', {
          dados: req.body,
          erros: null,
          erro: "Usuário não encontrado",
          dadosNotificacao: null
        });
      }

      if (aluno.alu_status == 0) {
        return res.render('pages/login', {
          dados: req.body,
          erros: null,
          erro: "Conta não ativada",
          dadosNotificacao: null
        });
      }

      const senhaOk = await bcrypt.compare(senha, aluno.alu_senha);

      if (!senhaOk) {
        return res.render('pages/login', {
          dados: req.body,
          erros: null,
          erro: "Senha incorreta",
          dadosNotificacao: null
        });
      }

      req.session.aluno = {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email
      };

      return res.redirect('/perfil');

    } catch (err) {
      console.error(err);
      return res.status(500).send("Erro no login");
    }
  },

  cadastrarAluno: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.render('pages/cadastro', {
        dados: req.body,
        erros: errors,
        dadosNotificacao: null
      });
    }

    const { nome, email, senha } = req.body;

    try {
      const existe = await AlunoModel.findByEmail(email);

      if (existe) {
        return res.render("pages/cadastro", {
          dados: req.body,
          erros: { errors: [{ path: "email", msg: "Email já cadastrado" }] },
          dadosNotificacao: {
            titulo: "Erro",
            mensagem: "Email já existe",
            tipo: "error"
          }
        });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoId = await AlunoModel.create({
        nome,
        email,
        senha: senhaHash
      });
      req.session.aluno_pendente = novoId;
      const token = jwt.sign(
        { userId: novoId },
        process.env.SECRET_KEY,
        { expiresIn: "1d" }
      );

      const html = require("../helpers/email-ativar-conta")(
        process.env.URL_BASE,
        token,
        nome
      );
  console.log("Link de ativação:", `${process.env.URL_BASE}/ativar-conta?token=${token}`);

      enviarEmail(email, "Ativação de conta", null, html, () => {
        return res.redirect('/imc');
      });

    } catch (err) {
      console.error(err);
      return res.render("pages/cadastro", {
        dados: req.body,
        erros: null,
        dadosNotificacao: {
          titulo: "Erro",
          mensagem: "Erro ao cadastrar",
          tipo: "error"
        }
      });
    }
  },

  ativarConta: async (req, res) => {
    try {
      const token = req.query.token;
      console.log("SECRET_KEY usada:", process.env.SECRET_KEY);
      console.log("Token recebido:", token);
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      console.log("Token decodificado:", decoded); 
      
      const aluno = await AlunoModel.findId(decoded.userId);
      console.log("Aluno encontrado:", aluno);     

      if (!aluno) {
        return res.render("pages/login", {
          dados: { email: "", senha: "" },
          erro: "Usuário não encontrado",
          dadosNotificacao: null
        });
      }

      await AlunoModel.ativarConta(decoded.userId);

      req.session.aluno_pendente = null;

      return res.render("pages/login", {
        dados: { email: "", senha: "" },
        erro: null,
        dadosNotificacao: {
          titulo: "Sucesso",
          mensagem: "Conta ativada com sucesso",
          tipo: "success"
        }
      });

    } catch (err) {
      console.log("Erro ao verificar token:", err.message);
      return res.render("pages/login", {
        dados: { email: "", senha: "" },
        erro: null,
        dadosNotificacao: {
          titulo: "Erro",
          mensagem: "Token inválido",
          tipo: "error"
        }
      });
    }
  },

    carregarPerfil: async (req, res) => {
  try {
    const user = req.session.aluno;
    const aluno = await AlunoModel.findByEmail(user.email);
    const imc = await imcModel.findByAluno(aluno.alu_id);

    let idade = null;
    if (aluno.alu_nasc) {
      const nasc = new Date(aluno.alu_nasc);
      const hoje = new Date();
      idade = hoje.getFullYear() - nasc.getFullYear();
      const m = hoje.getMonth() - nasc.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    }

    res.render("pages/perfil", {
      aluno: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        foto: aluno.alu_foto,
        nasc: aluno.alu_nasc,
        idade: idade,
        peso: imc ? Number(imc.peso).toFixed(1) + ' kg' : '—',
        altura: imc ? (Number(imc.altura) * 100).toFixed(0) + ' cm' : '—',
        imc: imc ? Number(imc.imc).toFixed(2) : '—',
        classificacaoImc: imc ? classificarImc(Number(imc.imc)) : '—'
      },
      dadosNotificacao: null
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},

  carregarEditarPerfil: async (req, res) => {
  try {
    const user = req.session.aluno;
    const aluno = await AlunoModel.findByEmail(user.email);
    const imc = await imcModel.findByAluno(aluno.alu_id);
    const nasc = aluno.alu_nasc ? aluno.alu_nasc.toISOString().split('T')[0] : "";

    res.render("pages/editar-perfil", {
      valores: {
        id: aluno.alu_id,
        nome: aluno.alu_nome,
        email: aluno.alu_email,
        foto: aluno.alu_foto,
        nasc: nasc,
        peso: imc ? (Number(imc.peso)).toFixed(1) : '',
        altura: imc ? (Number(imc.altura) * 100).toFixed(0) : ''
      },
      erros: null,
      dadosNotificacao: null
    });

  } catch (err) {
    console.error(err);
    return res.redirect("/login");
  }
},
gravarPerfil: async (req, res) => {
  try {
    const id = req.session.aluno?.id || req.body.alu_id;
    if (!id) return res.redirect('/login');

    const dadosForm = {      
      nome: req.body.nome,
      email: req.body.email,
    };

    if (req.body.senha && req.body.senha.trim() !== "") {
      if (req.body.senha !== req.body.repsenha) {
        return res.render("pages/editar-perfil", {
          valores: req.body,
          erros: { errors: [{ path: "senha", msg: "Senhas não conferem" }] },
          dadosNotificacao: null
        });
      }
      dadosForm.senha = req.body.senha;
    }

    if (req.file) {
      dadosForm.foto = `imagens/alunos/${req.file.filename}`;
    }

    await AlunoModel.update(id, dadosForm);

    if (req.session.aluno) {
      req.session.aluno.nome = dadosForm.nome;
      req.session.aluno.email = dadosForm.email;
    }

    if (req.body.peso && req.body.altura) {
      await imcModel.salvarOuAtualizar(id, req.body.peso, req.body.altura);
    }

    const imcAtualizado = await imcModel.findByAluno(id);

    return res.render("pages/editar-perfil", {
      valores: {
        id,
        nome: dadosForm.nome,
        email: dadosForm.email,
        foto: dadosForm.foto || req.body.foto,
        nasc: req.body.nasc || '',
        peso: imcAtualizado ? Number(imcAtualizado.peso).toFixed(1) : req.body.peso,
        altura: imcAtualizado ? (Number(imcAtualizado.altura) * 100).toFixed(0) : req.body.altura
      },
      erros: null,
      dadosNotificacao: {
        titulo: "Sucesso",
        mensagem: "Perfil atualizado com sucesso!",
        tipo: "success"
      }
    });

  } catch (err) {
    console.error(err);
    return res.render("pages/editar-perfil", {
      valores: req.body,
      erros: null,
      dadosNotificacao: {
        titulo: "Erro",
        mensagem: "Erro ao salvar perfil",
        tipo: "error"
      }
    });
  }
},
};

