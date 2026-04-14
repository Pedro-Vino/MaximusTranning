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
        email: aluno.alu_email,
        foto: aluno.alu_foto
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
  if (dadosForm.foto) {
    req.session.aluno.foto = dadosForm.foto;
  }
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
regrasValidacaoFormRecSenha: [
  body("email")
    .isEmail().withMessage("Digite um e-mail válido!")
    .custom(async (value) => {
      const aluno = await AlunoModel.findByEmail(value);
      if (!aluno) throw new Error("E-mail não encontrado");
    }),
],

recuperarSenha: async (req, res) => {
  console.log("=== recuperarSenha chamado ===");
  console.log("body:", req.body);
  const erros = validationResult(req);
  console.log("erros:", erros);
  if (!erros.isEmpty()) { 
    return res.render("pages/recuperar-senha", {
      erros: erros,
      dadosNotificacao: null
    });
  }
  try {
    const aluno = await AlunoModel.findByEmail(req.body.email);
    const token = jwt.sign(
      { userId: aluno.alu_id },
      process.env.SECRET_KEY,
      { expiresIn: "25m" }
    );

    const html = require("../helpers/email-reset-senha")(
      process.env.URL_BASE,
      token,
      aluno.alu_nome
    );

    enviarEmail(req.body.email, "Redefinição de senha", null, html, () => {
      return res.render("pages/recuperar-senha", {
        erros: null,
        dadosNotificacao: {
          titulo: "Email enviado",
          mensagem: "Verifique sua caixa de entrada para redefinir a senha",
          tipo: "success"
        }
      });
    });
  } catch (err) {
    console.error(err);
    return res.render("pages/recuperar-senha", {
      erros: null,
      dadosNotificacao: {
        titulo: "Erro",
        mensagem: "Erro ao enviar email",
        tipo: "error"
      }
    });
  }
},

validarTokenNovaSenha: async (req, res) => {
  const token = req.query.token;
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.render("pages/recuperar-senha", {
        erros: null,
        dadosNotificacao: {
          titulo: "Link expirado",
          mensagem: "Insira seu e-mail para iniciar o reset de senha",
          tipo: "error"
        }
      });
    }
    return res.render("pages/resetar-senha", {
      erros: null,
      alu_id: decoded.userId,
      dadosNotificacao: null
    });
  });
},

regrasValidacaoFormNovaSenha: [
  body("senha")
    .isLength({ min: 6 }).withMessage("Senha deve ter no mínimo 6 caracteres")
    .custom((value, { req }) => {
      if (value !== req.body.repsenha) throw new Error("As senhas não são iguais");
      return true;
    }),
],

resetarSenha: async (req, res) => {
  const erros = validationResult(req);
  if (!erros.isEmpty()) {
    return res.render("pages/resetar-senha", {
      erros: erros,
      alu_id: req.body.alu_id,
      dadosNotificacao: null
    });
  }
  try {
    const senhaHash = await bcrypt.hash(req.body.senha, 10);
    await AlunoModel.update(req.body.alu_id, { senha: senhaHash });
    return res.render("pages/login", {
      dados: { email: "", senha: "" },
      erros: null,
      erro: null,
      dadosNotificacao: {
        titulo: "Senha redefinida",
        mensagem: "Sua senha foi atualizada com sucesso!",
        tipo: "success"
      }
    });
  } catch (err) {
    console.error(err);
    return res.render("pages/resetar-senha", {
      erros: null,
      alu_id: req.body.alu_id,
      dadosNotificacao: {
        titulo: "Erro",
        mensagem: "Erro ao redefinir senha",
        tipo: "error"
      }
    });
  }
},
logout: (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
},
};

