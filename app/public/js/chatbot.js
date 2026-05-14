const chatToggle = document.getElementById("chat-toggle");
const chatbot = document.getElementById("chatbot");
const fecharChat = document.getElementById("fechar-chat");

const input = document.getElementById("chat-input");
const body = document.getElementById("chat-body");

/* ABRIR CHAT */

chatToggle.addEventListener("click", () => {

  chatbot.style.display = "flex";

  if(body.innerHTML.includes("quick-buttons")){

    body.innerHTML += `
      <div class="msg-bot">
        <b> Suporte:</b><br>
        Olá 👋<br>
        Bem-vindo ao suporte Maximus Training.<br>
        Como posso ajudar?
      </div>
    `;

  }

});

/* FECHAR CHAT */

fecharChat.addEventListener("click", () => {
  chatbot.style.display = "none";
});

/* BOTÕES */

function enviarPergunta(texto){

  input.value = texto;

  input.dispatchEvent(
    new KeyboardEvent("keypress", {
      key: "Enter"
    })
  );

}

/* ENVIAR */

input.addEventListener("keypress", async function(e){

  if(e.key === "Enter"){

    const mensagem = input.value;

    if(mensagem.trim() === ""){
      return;
    }

    const hora = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    body.innerHTML += `
      <div class="msg-user">
        <b>Você:</b> ${mensagem}
        <br>
        <small>${hora}</small>
      </div>
    `;

    input.value = "";

    body.scrollTop = body.scrollHeight;

    body.innerHTML += `
      <div class="msg-bot" id="digitando">
         Digitando...
      </div>
    `;

    body.scrollTop = body.scrollHeight;

    const resposta = await fetch("/chat", {

      method: "POST",

      headers:{
        "Content-Type":"application/json"
      },

      body: JSON.stringify({
        mensagem
      })

    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    const dados = await resposta.json();

    document.getElementById("digitando").remove();

    body.innerHTML += `
      <div class="msg-bot">
        <b> Bot:</b> ${dados.resposta}
        <br>
        <small>${hora}</small>
      </div>
    `;

    body.scrollTop = body.scrollHeight;

  }

});