//adm
router.get('/adm', async (req, res) => {
  try {
    const [alunos] = await db.query('SELECT * FROM aluno');

    res.render('pages/adm/home', { alunos });

  } catch (err) {
    console.error(err);
    res.render('pages/adm/home', { alunos: [] }); // evita quebrar
  }
});