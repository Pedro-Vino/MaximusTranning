# 🏋️‍♂️ Maximus Tranning - Sistema de Treinos por IMC

Aplicação web desenvolvida para calcular o **IMC (Índice de Massa Corporal)** de um aluno e, com base no resultado, **gerar um treino personalizado** adequado ao seu perfil.

---

## 🚀 Tecnologias utilizadas

* Node.js
* Express
* EJS (templating)
* MySQL
* Express-validator (validação de formulários)
* Bcrypt (hash de senhas)
* Express-session (sessões de usuário)

---

## 📋 Pré-requisitos

Antes de começar, você precisará ter instalado em sua máquina:

* Node.js
* MySQL
* Conta de e-mail válida para envio de notificações

---

## ⚙️ Instalação

Clone o repositório:

```bash
git clone https://github.com/Pedro-Vino/Maximus-Tranning
cd maximus-tranning
```

Caso necessário, desative o SSL estrito:

```bash
npm config set strict-ssl false
```

Instale as dependências:

```bash
npm install --save
```

Crie o banco de dados utilizando o script:

```sql
-- script.sql
```

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
APP_PORT=
EMAIL_USER=
SECRET_KEY=
EMAIL_SERVICE=
URL_BASE=
```

### Exemplo:

```env
DB_HOST = localhost
DB_USER = root
DB_PASSWORD =
DB_NAME = maximus_tranning
DB_PORT = 3306
APP_PORT = 3000
EMAIL_USER = email@email.com
SECRET_KEY = senhasecreta
EMAIL_SERVICE = gmail
URL_BASE = https://localhost:3000
```

---

## ▶️ Executando o projeto

```bash
npm start ou node app
```

O sistema estará disponível em:

```
http://localhost:3000
```

(ou na porta definida no `.env`)

---

## 📁 Estrutura do projeto

```
controllers/ → lógica de controle  
models/      → acesso ao banco de dados  
views/       → arquivos EJS  
public/      → arquivos estáticos (CSS, JS, imagens)  
routes/      → rotas do Express  
.env         → variáveis de ambiente  
```

---

## 📧 Contato

Email:

---

## 📌 Observações

* O sistema calcula o IMC do usuário e gera recomendações de treino automaticamente.
* As senhas são armazenadas de forma segura utilizando hash com bcrypt.
* Sessões são utilizadas para autenticação de usuários.
* Integração com e-mail para notificações.

---

Feito com 💪 para ajudar pessoas a treinarem melhor!
