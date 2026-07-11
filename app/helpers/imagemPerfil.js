const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'public', 'imagens', 'alunos');
const TAMANHO = 400;
const QUALIDADE = 75;

// Redimensiona/comprime a foto de perfil e grava com nome fixo por aluno
// (perfil_<id>.jpg), sobrescrevendo a anterior em vez de acumular arquivos novos.
async function salvarFotoPerfil(buffer, alunoId, fotoAntiga) {
    if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

    const nomeArquivo = `perfil_${alunoId}.jpg`;
    const caminhoCompleto = path.join(DIR, nomeArquivo);

    await sharp(buffer)
        .resize(TAMANHO, TAMANHO, { fit: 'cover' })
        .jpeg({ quality: QUALIDADE })
        .toFile(caminhoCompleto);

    if (fotoAntiga) {
        const nomeAntigo = path.basename(fotoAntiga);
        if (nomeAntigo !== nomeArquivo && nomeAntigo !== 'default_user.png') {
            fs.unlink(path.join(DIR, nomeAntigo), () => {});
        }
    }

    return `imagens/alunos/${nomeArquivo}`;
}

module.exports = { salvarFotoPerfil };
