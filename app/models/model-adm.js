const db = require('../../config/pool-conexoes');

const AdmModel = {

    buscarAlunos: async () => {
        const [rows] = await db.query('SELECT * FROM aluno');
        return rows;
    }

};

module.exports = AdmModel;