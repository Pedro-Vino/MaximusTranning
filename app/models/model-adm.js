const db = require('../../config/pool-conexoes');

const AdmModel = {

    buscarAlunos: async () => {
        const [rows] = await db.query('SELECT * FROM aluno');
        return rows;
    },

    atualizarAluno: async (alu_id, dados) => {
        const sql = `
            UPDATE aluno 
            SET alu_nome = ?, alu_email = ?, alu_status = ?
            WHERE alu_id = ?
        `;
        const [result] = await db.query(sql, [
            dados.nome,
            dados.email,
            parseInt(dados.status),
            alu_id
        ]);
        return result;
    }

};

module.exports = AdmModel;