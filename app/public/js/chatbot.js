const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const fecharChat = document.getElementById("fechar-chat");

const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const enviarBtn = document.getElementById("chat-enviar");
const body = document.getElementById("chat-body");

let chatIniciado = false;

function escapeHtml(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function horaAtual() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function adicionarMensagem(classe, htmlConteudo, hora) {
  const div = document.createElement("div");
  div.className = classe;
  div.innerHTML = `${htmlConteudo}<span class="msg-hora">${hora}</span>`;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
  return div;
}

/* ABRIR CHAT */

chatToggle.addEventListener("click", () => {
  const aberto = chatbot.style.display === "flex";
  chatbot.style.display = aberto ? "none" : "flex";

  if (!aberto) {
    if (!chatIniciado) {
      chatIniciado = true;
      adicionarMensagem(
        "msg-bot",
        "Olá! Bem-vindo ao suporte da Maximus Training. Como posso ajudar?",
        horaAtual()
      );
    }
    input.focus();
  }
});

/* FECHAR CHAT */

fecharChat.addEventListener("click", () => {
  chatbot.style.display = "none";
});

/* BOTÕES RÁPIDOS */

function enviarPergunta(texto) {
  input.value = texto;
  form.requestSubmit();
}

/* ENVIAR MENSAGEM */

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const mensagem = input.value.trim();
  if (mensagem === "") return;

  adicionarMensagem("msg-user", escapeHtml(mensagem), horaAtual());

  input.value = "";
  input.disabled = true;
  enviarBtn.disabled = true;

  const digitando = document.createElement("div");
  digitando.className = "msg-bot msg-digitando";
  digitando.innerHTML = "<span></span><span></span><span></span>";
  body.appendChild(digitando);
  body.scrollTop = body.scrollHeight;

  try {
    const [resposta] = await Promise.all([
      fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem })
      }),
      new Promise(resolve => setTimeout(resolve, 500))
    ]);

    const dados = await resposta.json();
    digitando.remove();
    adicionarMensagem("msg-bot", dados.resposta, horaAtual());
  } catch (err) {
    digitando.remove();
    adicionarMensagem(
      "msg-bot",
      "Não consegui me conectar agora. Tente novamente em instantes.",
      horaAtual()
    );
  } finally {
    input.disabled = false;
    enviarBtn.disabled = false;
    input.focus();
  }
});
