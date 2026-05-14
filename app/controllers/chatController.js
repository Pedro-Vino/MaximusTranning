// Função que responde mensagens
function responderMensagem(mensagem) {

  mensagem = mensagem.toLowerCase();

  // LOGIN
  if (
    mensagem.includes("login") ||
    mensagem.includes("entrar") ||
    mensagem.includes("acessar conta")
  ) {
    return "Para entrar na sua conta clique no botão LOGIN no topo do site.";
  }

  // CADASTRO
  if (
    mensagem.includes("cadastro") ||
    mensagem.includes("criar conta") ||
    mensagem.includes("registrar")
  ) {
    return "Para criar sua conta clique em CADASTRO no topo do site.";
  }

  // IMC
  if (
    mensagem.includes("imc") ||
    mensagem.includes("peso ideal")
  ) {
    return "Você pode calcular seu IMC na aba IMC do sistema.";
  }

  // TREINO
  if (
    mensagem.includes("treino") ||
    mensagem.includes("treinar") ||
    mensagem.includes("exercicios")
  ) {
    return "Os treinos personalizados aparecem após o cálculo do IMC.";
  }

  // PERFIL
  if (
    mensagem.includes("perfil") ||
    mensagem.includes("editar perfil")
  ) {
    return "Você pode editar seu perfil na aba PERFIL.";
  }

  // FOTO
  if (
    mensagem.includes("foto") ||
    mensagem.includes("imagem perfil")
  ) {
    return "Você pode alterar sua foto na área EDITAR PERFIL.";
  }

  // SENHA
  if (
    mensagem.includes("senha") ||
    mensagem.includes("esqueci minha senha")
  ) {
    return "Clique em RECUPERAR SENHA na tela de login.";
  }

  // EMAIL
  if (
    mensagem.includes("email") ||
    mensagem.includes("e-mail")
  ) {
    return "Verifique se seu email foi digitado corretamente.";
  }

  // CONTATO
  if (
    mensagem.includes("contato") ||
    mensagem.includes("suporte humano")
  ) {
    return "Você pode entrar em contato pela aba CONTATO.";
  }

  // PROPOSTA
  if (
    mensagem.includes("proposta") ||
    mensagem.includes("sobre o sistema")
  ) {
    return "Na aba NOSSA PROPOSTA você encontra mais detalhes sobre o projeto.";
  }

  // SAUDAÇÕES
  if (
    mensagem.includes("oi") ||
    mensagem.includes("ola") ||
    mensagem.includes("olá")
  ) {
    return "Olá 👋 Como posso ajudar você hoje?";
  }

  // AGRADECIMENTO
  if (
    mensagem.includes("obrigado") ||
    mensagem.includes("valeu")
  ) {
    return "Por nada 😄 Fico feliz em ajudar!";
  }

  // DESPEDIDA
  if (
    mensagem.includes("tchau") ||
    mensagem.includes("até mais")
  ) {
    return "Até mais 👋 Bons treinos!";
  }

  // RESPOSTA PADRÃO
  return "Não entendi muito bem 🤔 Tente perguntar sobre login, cadastro, IMC, treinos, perfil ou senha.";
}

// Controller
const enviarMensagem = (req, res) => {

  const mensagem = req.body.mensagem;

  const resposta = responderMensagem(mensagem);

  res.json({
    resposta
  });

};

module.exports = {
  enviarMensagem
};