function responderMensagem(mensagem) {
  mensagem = mensagem.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  // SAUDAÇÕES
  if (/^(oi|ola|olá|hey|opa|eai|e ai|bom dia|boa tarde|boa noite|tudo bem|tudo bom|como vai)/.test(mensagem)) {
    const saudacoes = [
      "Olá! 👋 Bem-vindo ao suporte da Maximus Training! Como posso ajudar?",
      "Oi! 😄 Estou aqui para ajudar. O que você precisa?",
      "Olá! Bora treinar? 💪 Me diga o que precisa!"
    ];
    return saudacoes[Math.floor(Math.random() * saudacoes.length)];
  }

  // LOGIN
  if (/login|entrar|acessar|nao consigo entrar|erro ao entrar/.test(mensagem)) {
    if (/esqueci|nao lembro|recuperar|redefinir|resetar/.test(mensagem)) {
      return "Para recuperar sua senha acesse <b>/recuperar-senha</b> ou clique em <b>Esqueci minha senha</b> na tela de login. Você receberá um link por email! 📧";
    }
    if (/erro|nao consigo|problema/.test(mensagem)) {
      return "Problemas para entrar? Verifique email e senha. Se sua conta não foi ativada, confira seu email (incluindo spam). Se persistir, acesse <b>/recuperar-senha</b>! 🔑";
    }
    return "Para acessar sua conta clique em <b>Conta</b> no topo do site → faça login com email e senha. Sua conta precisa estar ativada pelo email! 🔐";
  }

  // CADASTRO
  if (/cadastro|cadastrar|criar conta|registrar|registro|novo usuario|como.*cadastrar/.test(mensagem)) {
    return "Para criar sua conta: clique em <b>Conta → Cadastre-se</b>. Preencha nome, email, data de nascimento e senha → calcule seu IMC → ative sua conta pelo email enviado! 📝";
  }

  // ATIVAÇÃO DE CONTA
  if (/ativar|ativacao|ativação|email de ativacao|nao recebi|confirmar conta|aguardar/.test(mensagem)) {
    return "Após o cadastro e cálculo do IMC, enviamos um email de ativação. Verifique sua caixa de entrada e a pasta de <b>spam</b>. Clique no link para ativar! 📬";
  }

  // IMC
  if (/imc|indice de massa|massa corporal|peso ideal|calcular imc/.test(mensagem)) {
    if (/o que e|significa|significado/.test(mensagem)) {
      return "IMC = peso ÷ altura². Categorias:<br>• Abaixo de 18,5 → abaixo do peso<br>• 18,5 a 24,9 → peso ideal<br>• Acima de 25 → sobrepeso 📊";
    }
    if (/como|onde|calcular|atualizar/.test(mensagem)) {
      return "Calcule seu IMC em <b>/imc</b> no menu. Digite peso (kg) e altura (cm). Também pode atualizar em <b>Editar Perfil</b>! 📏";
    }
    return "Seu IMC define seu plano de treinos personalizado! Acesse <b>/imc</b> para calcular ou atualizar. Os treinos mudam automaticamente conforme seu IMC! 💪";
  }

  // TREINOS
  if (/treino|treinar|exercicio|musculacao|plano de treino|meu treino/.test(mensagem)) {
    if (/mudar|alterar|trocar|atualizar/.test(mensagem)) {
      return "Os treinos mudam automaticamente quando você atualiza peso e altura em <b>Editar Perfil</b>! O sistema recalcula seu IMC e ajusta os treinos. 🔄";
    }
    if (/como funciona|como e/.test(mensagem)) {
      return "Os treinos são divididos em A, B e C em ciclo diário. São personalizados pelo IMC:<br>• Abaixo do peso → ganho de massa<br>• Peso ideal → hipertrofia<br>• Acima do peso → emagrecimento 🏋️";
    }
    if (/concluir|completar|finalizar|marcar/.test(mensagem)) {
      return "Para concluir um treino acesse a <b>página inicial</b> (logado) e clique em <b>CONCLUIR TREINO</b>. Só é permitido um treino por dia! ✅";
    }
    if (/proximo|próximo|amanha|amanhã/.test(mensagem)) {
      return "Seus próximos treinos aparecem no seu <b>Perfil</b>! Os treinos rodam em ciclo A → B → C → A... Um por dia. 📅";
    }
    return "Seus treinos aparecem na <b>página inicial</b> após o login. São personalizados pelo IMC e alternam entre A, B e C diariamente. 💪";
  }

  // PROGRESSO
  if (/progresso|historico|histórico|sequencia|sequência|streak|dias seguidos|calorias/.test(mensagem)) {
    return "Seu progresso aparece no <b>Perfil</b>: sequência de dias, calorias estimadas e IMC atual. Cada treino concluído conta para sua sequência! 🔥";
  }

  // PERFIL
  if (/perfil|editar perfil|meus dados|atualizar dados/.test(mensagem)) {
    return "Para editar seu perfil: clique na sua <b>foto na navbar → Perfil → ícone de editar</b>. Você pode alterar nome, email, foto, peso, altura e senha! ✏️";
  }

  // FOTO
  if (/foto|imagem|avatar|foto de perfil|trocar foto/.test(mensagem)) {
    return "Para trocar sua foto: <b>Editar Perfil → clique na foto → escolha uma imagem → recorte → salve</b>. Formatos aceitos: JPG, PNG, WEBP (máx. 5MB)! 📸";
  }

  // SENHA
  if (/senha|password|trocar senha|alterar senha/.test(mensagem)) {
    if (/trocar|alterar|mudar|atualizar/.test(mensagem)) {
      return "Para trocar sua senha: <b>Editar Perfil → campo Nova senha → preencha e confirme → salve</b>. A senha precisa ter letras maiúsculas, minúsculas, números e símbolos! 🔒";
    }
    return "Esqueceu a senha? Acesse <b>/recuperar-senha</b> ou clique em <b>Esqueci minha senha</b> no login. Você receberá um link por email para redefinir! 📧";
  }

  // CONTATO
  if (/contato|suporte humano|atendimento|telefone|whatsapp/.test(mensagem)) {
    return "📞 WhatsApp: (11) 99987-3264<br>✉️ Email: pedro.ns@uni9.edu.br<br>📍 UNINOVE Campus Memorial — Barra Funda, SP<br>Ou acesse <b>/contato</b> no menu!";
  }

  // ENDEREÇO
  if (/endereco|endereço|onde fica|localizacao|como chegar|barra funda|uninove/.test(mensagem)) {
    return "🏋️ <b>UNINOVE — Campus Memorial (Prédio D)</b><br>Rua Deputado Salvador Julianelli, s/n<br>Barra Funda, São Paulo - SP<br>Acesse <b>/contato</b> para ver o mapa! 📍";
  }

  // HORÁRIOS
  if (/horario|horário|funcionamento|abre|fecha|que horas/.test(mensagem)) {
    return "🕐 Horários de funcionamento:<br>• Segunda a Sexta: 06h — 22h<br>• Sábado: 08h — 18h<br>• Domingo: 08h — 14h";
  }

  // PLANOS
  if (/plano|planos|mensalidade|preco|preço|valor|quanto custa/.test(mensagem)) {
    return "Para conhecer nossos planos e valores acesse <b>/planos</b> no menu! Temos opções para todos os objetivos. 💰";
  }

  // NOSSA PROPOSTA
  if (/proposta|sobre|projeto|o que e o maximus|o que é/.test(mensagem)) {
    return "A <b>Maximus Training</b> é um sistema de gestão de treinos personalizado pelo IMC. Cadastre-se, calcule seu IMC e receba treinos adaptados ao seu objetivo! Acesse <b>/proposta</b> para saber mais. 🐻";
  }

  // ADM
  if (/admin|adm|administrador|painel/.test(mensagem)) {
    return "O painel administrativo é acessível apenas por administradores em <b>/adm/login</b>. Se você é aluno, acesse normalmente pela tela de <b>Login</b>! 🔐";
  }

  // SUPORTE
  if (/suporte|ajuda|help|duvida|dúvida/.test(mensagem)) {
    return "Estou aqui para ajudar! 😄 Pode perguntar sobre:<br>• Login / Cadastro / Ativação<br>• IMC / Treinos / Progresso<br>• Perfil / Foto / Senha<br>• Contato / Localização / Planos";
  }

  // AGRADECIMENTO
  if (/obrigado|obrigada|valeu|vlw|thanks|grato/.test(mensagem)) {
    const respostas = [
      "Por nada! 😄 Bons treinos!",
      "Disponha! 💪 Qualquer dúvida é só chamar!",
      "Fico feliz em ajudar! 🐻 Foco no treino!"
    ];
    return respostas[Math.floor(Math.random() * respostas.length)];
  }

  // DESPEDIDA
  if (/tchau|ate mais|até mais|bye|até logo|falou|xau/.test(mensagem)) {
    return "Até mais! 👋 Bons treinos na Maximus Training! 💪🐻";
  }

  // PROBLEMA / BUG
  if (/problema|erro|bug|nao funciona|não funciona|travou/.test(mensagem)) {
    return "Desculpe o inconveniente! 😕 Tente recarregar a página. Se persistir, entre em contato: <b>(11) 99987-3264</b> ou acesse <b>/contato</b>!";
  }

  // PADRÃO
  return "Não entendi muito bem 🤔 Tente perguntar sobre:<br>• Login / Cadastro / Ativação<br>• IMC / Treinos / Progresso<br>• Perfil / Foto / Senha<br>• Contato / Localização / Planos";
}

const enviarMensagem = (req, res) => {
  const { mensagem } = req.body;
  if (!mensagem || mensagem.trim() === "") {
    return res.json({ resposta: "Por favor, digite uma mensagem." });
  }
  const resposta = responderMensagem(mensagem);
  res.json({ resposta });
};

module.exports = { enviarMensagem };