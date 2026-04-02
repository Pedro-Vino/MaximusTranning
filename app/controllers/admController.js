const AdmModel = require('../models/model-adm');
const bcrypt = require('bcryptjs');

//verificar se o usuário é admin
exports.verificarAdm = async (req, res, next) => {
    try {
        if (!req.session || !req.session.usuario) {
            return res.redirect("/adm/login");
        }

        const user = await AdmModel.UserFindId(req.session.usuario.id);

        if (!user || user.tipo !== "a") {
            return res.redirect("/");
        }

        next(); 
    } catch (error) {
        console.error("Erro no verificar nivel:", error);
        res.redirect("/adm/login");
    }
};

// Página HOME
exports.home = async (req, res) => {
    try {
        const alunos = await AdmModel.buscarAlunos();
        res.render('pages/adm/home', { alunos });
    } catch (err) {
        console.error(err);
        res.render('pages/adm/home', { alunos: [] });
    }
};

// Página LOGIN
exports.loginPage = (req, res) => {
    res.render('pages/adm/login', { erro: null });
};

//Login POST
exports.login = async (req, res) => {
    const { id, senha } = req.body;

    // Aqui você pode usar USER hardcoded ou buscar no DB
    if (id === "admMaximus" && senha === "adm123456") {
        try {
            const alunos = await AdmModel.buscarAlunos();
            // Salva sessão do usuário
            req.session.usuario = { id, tipo: "a" };
            res.render('pages/adm/home', { usuario: id, alunos });
        } catch (err) {
            console.error(err);
            res.render('pages/adm/home', { usuario: id, alunos: [] });
        }
    } else {
        res.render('pages/adm/login', { erro: "ID ou senha incorretos" });
    }
};

//Formulário aluno
exports.formAluno = (req, res) => {
    res.render('pages/formulario');
};

//Cadastro aluno
exports.cadastrarAluno = async (req, res) => {
    const { nome, email, senha, peso, altura } = req.body;
    try {
        await AdmModel.cadastrarAluno({ nome, email, senha, peso, altura });
        res.send('Aluno cadastrado com sucesso!');
    } catch (err) {
        console.error(err);
        res.send('Erro ao cadastrar aluno');
    }
};