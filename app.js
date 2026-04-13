const express = require('express');
const app = express();
const port = 3000;
const axios = require('axios');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
require("dotenv").config();

app.use(helmet({
  contentSecurityPolicy: false // apenas para desenvolvimento
}));

app.use(express.static('app/public'));

app.set('view engine', 'ejs');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'maxmustranningnota10',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false 
  }
}));

const rotas = require('./app/routes/router');
app.use('/', rotas);

app.use((err, req, res, next) => {
  console.error("ERRO GERAL:", err.stack);
  res.status(500).send(`<pre>${err.stack}</pre>`);
});
// EM MANUTENÇÃO
// const rotasAdm = require('./app/routes/routerAdm');
// app.use('/adm/', rotasAdm);

app.set("/navbar", './app/views/partial/navbar')

app.listen(port, () =>{
    console.log(`Servidor online \nhttp://localhost:${port}...`);
})
//ypoj lefc opof kdro