const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const AlunoModel = require('../models/model-aluno');
const { obterTreinoAtual } = require('../helpers/treinoAtual');

const LOGO_PATH = path.join(__dirname, '..', 'public', 'imagens', 'LogoSemFgrande.png');

const CATEGORIA_LABEL = {
  abaixo: 'Abaixo do peso',
  ideal: 'Peso ideal',
  acima: 'Acima do peso'
};

function lerLogoBase64() {
  try {
    const buffer = fs.readFileSync(LOGO_PATH);
    return `data:image/png;base64,${buffer.toString('base64')}`;
  } catch (err) {
    return null;
  }
}

// Quebra a descrição do treino (mesmo texto usado em home.ejs via
// descricao.split(',')) em exercícios com nome/séries/repetições,
// separando a frase final "Foco em..." como observação.
function parseDescricaoTreino(descricao) {
  const frases = descricao.split('.').map(f => f.trim()).filter(Boolean);
  const blocoExercicios = frases[0] || '';
  const observacao = frases.slice(1).join('. ') || null;

  const exercicios = blocoExercicios.split(',').map(item => item.trim()).filter(Boolean).map(item => {
    const match = item.match(/^(.+?)\s+(\d+)\s*[xX]\s*(\d+)\s*(s|min)?$/);
    if (match) {
      const [, nome, series, reps, sufixo] = match;
      return { nome, series, repeticoes: reps + (sufixo || '') };
    }
    return { nome: item, series: '-', repeticoes: '-' };
  });

  return { exercicios, observacao };
}

const baixarTreinoPdf = async (req, res) => {
  let browser;
  try {
    const sessaoAluno = req.session.aluno;
    const id = sessaoAluno?.id || sessaoAluno?.alu_id;
    if (!id) return res.redirect('/login');

    const aluno = await AlunoModel.findId(id);
    const { treinoAtual, categoria } = await obterTreinoAtual(id);

    if (!treinoAtual) {
      return res.redirect('/perfil?semTreino=1');
    }

    const { exercicios, observacao } = parseDescricaoTreino(treinoAtual.descricao);
    const dataFormatada = new Date().toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });

    const html = await new Promise((resolve, reject) => {
      req.app.render('pdf/treino-pdf', {
        aluno: { nome: aluno.alu_nome },
        treino: { ...treinoAtual, observacao },
        categoriaLabel: CATEGORIA_LABEL[categoria] || '-',
        exercicios,
        dataFormatada,
        logoBase64: lerLogoBase64()
      }, (err, html) => err ? reject(err) : resolve(html));
    });

    browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfUint8Array = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' }
    });
    await browser.close();

    // page.pdf() retorna Uint8Array, não Buffer — sem essa conversão o
    // res.send() do Express trata como objeto e serializa em JSON,
    // corrompendo o download.
    const pdfBuffer = Buffer.from(pdfUint8Array);

    const nomeArquivo = `treino-${treinoAtual.nome}-${aluno.alu_nome.replace(/\s+/g, '_')}.pdf`;
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
      'Content-Length': pdfBuffer.length
    });
    return res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    if (browser) await browser.close();
    return res.redirect('/perfil');
  }
};

module.exports = { baixarTreinoPdf };
