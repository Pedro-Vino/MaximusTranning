const AlunoModel = require('../models/model-aluno');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../helpers/email");

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

      res.render("pages/perfil", {
        aluno: {
          id: aluno.alu_id,
          nome: aluno.alu_nome,
          email: aluno.alu_email,
          foto: aluno.alu_foto,
          nasc: aluno.alu_nasc
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
      const nasc = aluno.alu_nasc ? aluno.alu_nasc.toISOString().split('T')[0] : "";

      res.render("pages/editar-perfil", {
        valores: {
          id: aluno.alu_id,
          nome: aluno.alu_nome,
          email: aluno.alu_email,
          foto: aluno.alu_foto,
          nasc: nasc
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
        const id = req.session.aluno.id;
        const dadosForm = {
            nome: req.body.nome,
            email: req.body.email,
        };

        // Atualiza senha só se preenchida
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

        // Atualiza foto se enviada
        if (req.file) {
            dadosForm.foto = `imagens/alunos/${req.file.filename}`;
        }

        await AlunoModel.update(id, dadosForm);

        // Atualiza sessão
        req.session.aluno.nome = dadosForm.nome;
        req.session.aluno.email = dadosForm.email;

        return res.render("pages/editar-perfil", {
            valores: {
                id,
                nome: dadosForm.nome,
                email: dadosForm.email,
                foto: dadosForm.foto || req.body.foto,
                nasc: req.body.nasc || ''
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

// const AlunoModel = require('../models/model-aluno');
// const bcrypt = require('bcryptjs');
// const { body, validationResult } = require("express-validator");
// const https = require("https");
// const jwt = require("jsonwebtoken");
// const { enviarEmail } = require("../helpers/email");
// const emailAtivarConta = require("../helpers/email-ativar-conta");

// module.exports = {
//     regrasValidacao: [
//     body("nome").isLength({min:3,max:30}).withMessage("Insira um nome válido."),
//     body("email").isEmail().withMessage("Email inválido."),
//     body("senha").isStrongPassword().withMessage("Senha muito fraca!"),
//     body("repsenha").custom((value, { req }) => {
//     return value === req.body.senha;
//     }).withMessage("Senhas estão diferentes"),
//   ],
//   exibirLogin: (req, res) => {
//     res.render('pages/login');
//   },

//   realizarLogin: async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.render('pages/login', {
//       erros: errors,
//       dados: req.body
//     });
//   }

//   const { email, senha } = req.body;

//   try {
//     const aluno = await AlunoModel.findByEmail(email);

//     if (!aluno) {
//       return res.render('pages/login', {
//         erro: 'Usuário não encontrado!',
//         dados: req.body
//       });
//     }

//     if (aluno.status === 0) {
//       return res.render('pages/login', {
//         erro: 'Conta não ativada! Verifique seu email.',
//         dados: req.body
//       });
//     }

//     const senhaValida = await bcrypt.compare(senha, aluno.alu_senha);

//     if (!senhaValida) {
//       return res.render('pages/login', {
//         erro: 'Senha incorreta!',
//         dados: req.body
//       });
//     }

//     req.session.aluno = {
//       id: aluno.alu_id,
//       nome: aluno.alu_nome,
//       email: aluno.alu_email
//     };

//     res.redirect('/home');

//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Erro ao fazer login');
//   }
// },
// cadastrarAlunoNormal: async (req, res) => {
//   const errors = validationResult(req);

//   if (!errors.isEmpty()) {
//     return res.render('pages/registro', {
//       dados: req.body,
//       erros: errors,
//       dadosNotificacao: null
//     });
//   }

//   try {
//     const { nome, email, senha, nasc } = req.body;

//     const alunoExistente = await AlunoModel.findByEmail(email);

//     if (alunoExistente) {
//       return res.render("pages/registro", {
//         dados: req.body,
//         erros: { errors: [{ path: 'email', msg: "Email já cadastrado" }] },
//         dadosNotificacao: {
//           titulo: "Erro",
//           mensagem: "Este email já existe!",
//           tipo: "error",
//         }
//       });
//     }

//     const senhaHash = await bcrypt.hash(senha, 10);

//     const novoAluno = await AlunoModel.create({
//       nome,
//       email,
//       senha: senhaHash,
//       foto: "imagens/alunos/default_user.jpg",
//       banner: "imagens/alunos/default_background.jpg",
//       status: 0,
//       nasc
//     });

//     const token = jwt.sign(
//       { userId: novoAluno.insertId },
//       process.env.SECRET_KEY,
//       { expiresIn: "1d" }
//     );

//     const html = require('../helpers/email-ativar-conta')(
//       process.env.URL_BASE,
//       token,
//       nome
//     );

//     enviarEmail(email, "Ativação de conta", null, html, (erro) => {
//       if (erro) {
//         return res.render("pages/registro", {
//           erros: [{ msg: "Erro ao enviar email" }],
//           dadosNotificacao: null,
//           dados: req.body
//         });
//       }

//       return res.render("pages/registro", {
//         erros: null,
//         dadosNotificacao: {
//           titulo: "Cadastro realizado!",
//           mensagem: "Verifique seu email para ativar a conta",
//           tipo: "success",
//         },
//         dados: req.body
//       });
//     });

//   } catch (e) {
//     console.error(e);
//     res.render("pages/registro", {
//       dados: req.body,
//       erros: { errors: [{ msg: "Erro ao cadastrar" }] },
//       dadosNotificacao: null
//     });
//   }
// },
// ativarConta: async (req, res) => {
//   try {
//     const token = req.query.token;

//     const decoded = jwt.verify(token, process.env.SECRET_KEY);

//     const user = await AlunoModel.findId(decoded.userId);

//     if (!user) {
//       return res.render("pages/login", {
//         dadosNotificacao: {
//           titulo: "Erro",
//           mensagem: "Usuário não encontrado",
//           tipo: "error"
//         },
//         dados: { email: "", senha: "" }
//       });
//     }

//     await AlunoModel.ativarConta(decoded.userId);

//     res.render("pages/login", {
//       dadosNotificacao: {
//         titulo: "Sucesso",
//         mensagem: "Conta ativada com sucesso!",
//         tipo: "success"
//       },
//       dados: { email: "", senha: "" }
//     });

//   } catch (err) {
//     res.render("pages/login", {
//       dadosNotificacao: {
//         titulo: "Erro",
//         mensagem: "Token inválido ou expirado",
//         tipo: "error"
//       },
//       dados: { email: "", senha: "" }
//     });
//   }
// }


// }


//   // cadastrarAlunoNormal: async (req, res) => {
    
//   //   const errors = validationResult(req);
//   //       if(!errors.isEmpty()) {

//   //           return res.render('pages/registro',{
//   //               dados: req.body,
//   //               erros: errors,
//   //               dadosNotificacao: ""
//   //           })
//   //       }

//   //   try {

//   //     const {nome, email, senha, nasc } = req.body;

//   //     if (email){
//   //     const alunoExistente = await AlunoModel.findByEmail(email);
//   //     if (alunoExistente) {
//   //      return res.render("pages/registro", {
//   //       dados: req.body,
//   //       erros: { errors: [{ path: 'email', msg: "Este email já está cadastrado" }] },
//   //       dadosNotificacao: {
//   //         titulo: "Falha ao cadastrar!",
//   //         mensagem: "Este e-mail já está cadastrado!",
//   //         tipo: "error",
//   //       },
//   //     });
//   //   }


//   //     }
     
//   //     
// // ,

// //   regrasValidacaoFormNovaSenha: [
// //     body("senha")
// //       .isStrongPassword()
// //       .withMessage(
// //         "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
// //       )
// //       ,
// //     body("rep_senha")
// //       .isStrongPassword()
// //       .withMessage(
// //         "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
// //       ).custom(async (value, { req }) => {
// //         if (value !== req.body.rep_senha) {
// //           throw new Error("As senhas não são iguais!");
// //         }
// //       }),
// //   ],

// //   regrasValidacaoFormRecSenha: [
// //     body("email")
// //       .isEmail()
// //       .withMessage("Digite um e-mail válido!")
// //       .custom(async (value) => {
// //         const nomeAlu = await AlunoModel.findByEmail(value);
// //         if (!nomeAlu) {
// //           throw new Error("E-mail não encontrado");
// //         }
// //       }),
// //   ],


// //   recuperarSenha: async (req, res) => {
// //     const erros = validationResult(req);
// //     console.error(erros);
// //     if (!erros.isEmpty()) {
// //       return res.render("pages/recuperar-senha", {
// //         dados: req.body,
// //         dadosNotificacao: null,
// //         erros: erros
// //       });
// //     }
// //     try {
// //       //logica do token
// //       user = await AlunoModel.findByEmail(req.body.email);
// //       const token = jwt.sign(
// //         { userId: user.alu_id, expiresIn: "25m" },
// //         process.env.SECRET_KEY
// //       );

// //       //enviar e-mail com link usando o token
// //       html = require("../helpers/email-reset-senha")(process.env.URL_BASE, token, user.alu_nome)
// //       enviarEmail(req.body.email, "Pedido de recuperação de senha", null, html, ()=>{
// //         return res.render("pages/recuperar-senha", {
// //           erros: null,
// //           dadosNotificacao: {
// //             titulo: "Recuperação de senha",
// //             mensagem: "Enviamos um e-mail com instruções para resetar sua senha",
// //             tipo: "success",
// //           },
// //           dados: req.body
// //         });
// //       });

// //     } catch (e) {

// //     }
// //   },

// //   validarTokenNovaSenha: async (req, res) => {
// //     //receber token da URL
// //     const token = req.query.token;

// //     //validar token
// //     jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
// //       if (err) {
// //         res.render("pages/recuperar-senha", {
// //           erros: null,
// //           dadosNotificacao: { titulo: "Link expirado!", mensagem: "Insira seu e-mail para iniciar o reset de senha.", tipo: "error", },
// //           dados: req.body,
          
// //         });
// //       } else {
// //         res.render("pages/resetar-senha", {
// //           erros: null,
// //           aluno: req.session.aluno,
// //           alu_id: decoded.userId,
// //           dadosNotificacao: null
// //         });
// //       }
// //     });
// //   },

// //   regrasValidacaoFormNovaSenha: [
// //     body("senha")
// //       .isStrongPassword()
// //       .withMessage(
// //         "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
// //       )
// //       .custom(async (value, { req }) => {
// //         if (value !== req.body.rep_senha) {
// //           throw new Error("As senhas não são iguais!");
// //         }
// //       }),
// //     body("rep_senha")
// //       .isStrongPassword()
// //       .withMessage(
// //         "A senha deve ter no mínimo 8 caracteres (mínimo 1 letra maiúscula, 1 caractere especial e 1 número)"
// //       ),
// //   ],
  
// //   resetarSenha: async (req, res) => {
// //     const erros = validationResult(req);

// //     if (!erros.isEmpty()) {
// //       return res.render("pages/resetar-senha", {
// //         erros: erros,
// //         dadosNotificacao: null,
// //         dados: req.body,
// //         alu_id: req.body.alu_id
// //       });
// //     }
// //     try {
// //       //gravar nova senha
// //       senha = await bcrypt.hash(req.body.senha, 10);

// //       const resetar = await AlunoModel.atualizar(req.body.alu_id, {senha:senha} );

// //       res.redirect("/login");
// //     } catch (e) {

// //     }
// //   },


// //   regrasValidacaoLogin :[
// //   body("email").isEmail().withMessage("Email inválido.")
// // ],
 

// // autenticarAluno: async (req, res, tipo = "c") => {
// //     let pag = "pages/login";
// //       switch(tipo){
// //         case "c": pag = 'pages/login'; break;
// //         case "o": pag = 'pages/login'; break;
// //         case "a": pag = 'pages/adm/login'; break;
// //         default : pag = 'pages/login'; break;
// //       }
// //     try {

// //       const errors = validationResult(req);
// //         if(!errors.isEmpty()) {

// //             return res.render(pag,{
// //                 dados: req.body,
// //                 erros: errors,
// //                 dadosNotificacao: null
// //             })
// //         }

// //       const { email, senha } = req.body;
     
// //       const aluno = await AlunoModel.findByEmail(email);
     
// //       if (!aluno) {
// //         return res.render(pag, {
// //            dados: req.body,
// //           erros: { errors: [{ path: 'email', msg: "Este email não está cadastrado ou está digitado errado." }] },
// //           dadosNotificacao: {
// //             titulo: "E-mail não cadastrado",
// //             mensagem: "Este e-mail não está cadastrado ou está digitado errado.",
// //             tipo: "error",
// //           }
// //         });
// //       }
     
// //       const senhaCorreta = await bcrypt.compare(senha, aluno.alu_senha);
     
// //       if (!senhaCorreta) {
// //         return res.render(pag, {
// //            dados: req.body,
// //           erros: { errors: [{ path: 'senha', msg: "Senha incorreta." }] },
// //           dadosNotificacao: {
// //             titulo: "Senha incorreta",
// //             mensagem: "A senha digitada está incorreta.",
// //             tipo: "error",
// //           }
// //         });
// //       }
     
// //       req.session.aluno = {
// //         id: aluno.alu_id,
// //         email: aluno.alu_email,
// //         nome: aluno.alu_nome,
// //         foto: aluno.alu_foto,
// //         banner: aluno.alu_banner,
// //         tipo: aluno.tipo
// //       };
      
// //       if (aluno.tipo === "a") {
// //        res.redirect("/adm/home");
// //       } else {
// //         res.redirect("/perfil");
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       res.render(pag, {
// //         dados: req.body,
// //         erros: { errors: [{ path: 'email', msg: "Erro ao logar, tente novamente mais tarde." }] },
// //         dadosNotificacao: {
// //             titulo: "Algo deu errado!",
// //             mensagem: "Algum erro ocorreu, tente novamente mais tarde.",
// //             tipo: "error",
// //           }
// //       });
// //     }
// //   },
 
// //   logout: (req, res) => {
// //     req.session.destroy(() => {
// //       res.redirect("/login");
// //     });
// //   },

// //   carregarPerfil: async (req, res) => {
// //   try {
// //     const user = req.session.aluno;
// //     var aluninfos = await AlunoModel.findByEmail(user.email);
// //     aluninfos.tipo = aluninfos.tipo[0].toUpperCase() + aluninfos.tipo.substring(1);

// //     let ingressos = await AlunoModel.findIngressosInscritos(aluninfos.alu_id);
    
    
// //     res.render("pages/perfil", {
// //         aluno: {
// //         id: aluninfos.alu_id,
// //         nome: aluninfos.alu_nome,
// //         email: aluninfos.alu_email,
// //         arroba: aluninfos.perf_nome,
// //         seguidores: aluninfos.quantidade_seguidores,
// //         seguindo: aluninfos.quantidade_seguindo,
// //         foto: aluninfos.alu_foto,
// //         banner: aluninfos.alu_banner,
// //         tipo: aluninfos.tipo,
// //         },
// //         ingressos: ingressos,
// //         dadosNotificacao:""
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     return res.redirect("/login");
// //   }
// // },

// //   carregarEditarPerfil: async (req, res) => {
// //   try {
// //     const user = req.session.aluno;
// //     const aluninfos = await AlunoModel.findByEmail(user.email);
// //     aluninfos.alu_nasc = aluninfos.alu_nasc ? aluninfos.alu_nasc.toISOString().split('T')[0] : "";

// //     res.render("pages/editar-perfil", {
// //         valores: {
// //         id: aluninfos.alu_id,
// //         nome: aluninfos.alu_nome,
// //         email: aluninfos.alu_email,
// //         arroba: aluninfos.perf_nome,
// //         foto: aluninfos.alu_foto,
// //         banner: aluninfos.alu_banner,
// //         nasc: aluninfos.alu_nasc
// //         },
// //         erros:"",
// //         dadosNotificacao:""
// //     });

// //   } catch (err) {
// //     console.error(err);
// //     return res.redirect("/login");
// //   }
// // },

// //     regrasValidacaoPerfil: [
// //         body("nome")
// //         .optional()
// //             .isLength({ min: 3, max: 45 }).withMessage("Nome deve ter de 3 a 45 caracteres!"),
// //         body("email")
// //         .optional()
// //             .isEmail().withMessage("Digite um e-mail válido!"),
// //         body("senha")
// //         .optional({ checkFalsy: true })
// //         .isStrongPassword().withMessage("Senha muito fraca!"),
// //         body("repsenha").custom((value, { req }) => {
// //           return value === req.body.senha;
// //         }).withMessage("Senhas estão diferentes")      
// //     ],

// //     gravarPerfil: async (req, res) => {
// //       const erros = validationResult(req);
// //       const erroMulter = req.session.erroMulter;
// //        if (!erros.isEmpty() || erroMulter != null ) {
// //             lista =  !erros.isEmpty() ? erros : {formatter:null, errors:[]};
// //             if(erroMulter != null ){
// //                 lista.errors.push(erroMulter);
// //             } 

// //             return res.render("pages/editar-perfil", { 
// //               erros: lista, 
// //               valores: {
// //               nome: req.body.nome,
// //               email: req.body.email,
// //               foto: req.session.aluno.foto,
// //               banner: req.session.aluno.banner,
// //               senha: ""
                
// //               }, 
// //               dadosNotificacao: {
// //                   titulo: "Erro ao atualizar o perfil!",
// //                   mensagem: "Verifique se os dados foram inseridos corretamente.",
// //                   tipo: "error"
// //               } })
// //         }
// //         try {
// //             var dadosForm = {
// //                 nome: req.body.nome,
// //                 email: req.body.email,
// //                 foto: req.session.aluno.foto,
// //                 banner: req.session.aluno.banner,
// //                 senha: req.body.senha,
// //             };

// //               if (req.body.senha && req.body.senha.trim() !== "") {
// //                   dadosForm.senha = bcrypt.hashSync(req.body.senha, 10);
// //               } else {
// //                   delete dadosForm.senha; // Remove do objeto para não sobrescrever
// //               }
// //             if (!req.files || (!req.files.foto && !req.files.banner)) {

// //               } else {
// //                 if (req.files.foto) {
// //                   const caminhoFoto = "imagens/perfil/" + req.files.foto[0].filename;
// //                   if (dadosForm.foto !== caminhoFoto && dadosForm.foto !== "imagens/alunos/default_user.jpg") removeImg(dadosForm.foto);
// //                   dadosForm.foto = caminhoFoto;
// //                 }

// //                 if (req.files.banner) {
// //                   const caminhoBanner = "imagens/perfil/" + req.files.banner[0].filename;
// //                   if (dadosForm.banner !== caminhoBanner && dadosForm.banner !== "imagens/alunos/default_background.jpg") removeImg(dadosForm.banner);
// //                   dadosForm.banner = caminhoBanner;
// //                 }
// //               }

// //             let resultUpdate = await AlunoModel.atualizar(req.session.aluno.id, dadosForm);
// //             if (resultUpdate) {
// //                 if (resultUpdate.changedRows == 1) {
// //                   var result = await AlunoModel.findId(req.session.aluno.id);
// //                   var aluno = {
// //                     nome: result.alu_nome,
// //                     id: result.alu_id,
// //                     foto: result.alu_foto,
// //                     email: result.alu_email,
// //                     banner: result.alu_banner,
// //                     tipo: result.tipo,
// //                   }
                
                  
// //                    req.session.aluno = aluno;

// //                   var valores = aluno;
// //                   valores.senha = "";

// //                   //salvo certo
// //                   res.render("pages/editar-perfil", {
// //                     erros: null,
// //                     valores: valores,
// //                     dadosNotificacao: { 
// //                       titulo: "Perfil! atualizado com sucesso", 
// //                       mensagem: "Alterações Gravadas", 
// //                       tipo: "success" 
// //                   }
// //                   });
// //                 } else {

// //                   res.render("pages/editar-perfil", {
// //                     erros: null,
// //                     valores: dadosForm,
// //                     dadosNotificacao: { 
// //                       titulo: "Perfil! atualizado com sucesso", 
// //                       mensagem: "Sem alterações", 
// //                       tipo: "success" 
// //                     }
// //                 });
// //                 }
// //             }

// //     } catch(e){

// //       res.render("pages/editar-perfil", {valores: req.body, erros: erros,
// //         dadosNotificacao: {  
// //           titulo: "Erro ao atualizar o perfil!", 
// //           mensagem: "Verifique os valores digitados!", 
// //           tipo: "error" 
// //         }
// //       })

// //     }
// //   },
// // };