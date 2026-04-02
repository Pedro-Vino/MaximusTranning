const AdmModel = require('../models/model-adm');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require("express-validator");
const db = require('../../config/pool-conexoes');

verificarAdm: async (req, res, next) => {
        try {
            if (!req.session || !req.session.usuario) {
                return res.redirect("/adm/login");
            }

            user = await AdmModel.UserFindId(req.session.usuario.id)
            user = user.tipo

            if (user !== "a") {
                return res.redirect("/");
            }

            next(); 
        } catch (error) {
            console.error("Erro no verificar nivel:", error);
            res.redirect("/adm/login");
        }
    },

    exports.home = async (req, res) => {
        try {
            const [alunos] = await db.query('SELECT * FROM aluno');

            res.render('pages/adm/home', { alunos });

        } catch (err) {
            console.error(err);
            res.render('pages/adm/home', { alunos: [] });
        }
    };