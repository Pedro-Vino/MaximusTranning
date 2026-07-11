const multer = require('multer');

// Guarda o arquivo em memória (buffer) em vez de gravar no disco direto.
// O processamento/compressão (ver helpers/imagemPerfil.js) é quem grava o arquivo final.
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png', 'image/webp'];
        allowed.includes(file.mimetype) ? cb(null, true) : cb(new Error('Formato inválido'));
    }
});

module.exports = upload;