document.addEventListener("DOMContentLoaded", function () {
    const senhaInput = document.getElementById("senha");
    const repsenhaInput = document.getElementById("repsenha");
    const toggleBtn = document.getElementById("toggleSenha");
    const ctoggleBtn = document.getElementById("ctoggleSenha");

    const imgAberto = "imagens/olhos-abertos.png";
    const imgFechado = "imagens/olhos-fechados.png";

    toggleBtn.addEventListener("click", function () {
        const isPassword = senhaInput.type === "password";
        senhaInput.type = isPassword ? "text" : "password";
        toggleBtn.innerHTML = `<img src="${isPassword ? imgAberto : imgFechado}" alt="Mostrar senha" width="40">`;
    });

    ctoggleBtn.addEventListener("click", function () {
        const isPassword = repsenhaInput.type === "password";
        repsenhaInput.type = isPassword ? "text" : "password";
        ctoggleBtn.innerHTML = `<img src="${isPassword ? imgAberto : imgFechado}" alt="Mostrar senha" width="40">`;
    });

    // Inicializa com imagem "fechado"
    toggleBtn.innerHTML = `<img src="${imgFechado}" alt="Mostrar senha" width="40">`;
    ctoggleBtn.innerHTML = `<img src="${imgFechado}" alt="Mostrar senha" width="40">`;
});

    // REGISTRAR

 document.addEventListener('DOMContentLoaded', function() {
    // 1. Seleciona os inputs de senha
    const inputSenha = document.getElementById('senha');
    const inputRepetirSenha = document.getElementById('repsenha');

    // 2. Define a função que impede o evento
    function impedirCopiaColagem(event) {
        // Previne a ação padrão do evento (copiar ou colar)
        event.preventDefault();
        
        // Opcional: Notificar o usuário sobre a restrição (utiliza a função 'notify' do seu código)
        if (typeof notify === 'function') {
             notify("Restrição de segurança", 
                    "Por segurança, a digitação da senha é obrigatória. Não é permitido copiar ou colar.", 
                    "warning", "right bottom", 3000);
        }
        
        // Opcional: Você pode querer focar o input novamente
        event.target.focus();
    }

    // 3. Adiciona os listeners para os eventos 'copy' e 'paste'
    if (inputSenha) {
        inputSenha.addEventListener('copy', impedirCopiaColagem);
        inputSenha.addEventListener('paste', impedirCopiaColagem);
    }

    if (inputRepetirSenha) {
        inputRepetirSenha.addEventListener('copy', impedirCopiaColagem);
        inputRepetirSenha.addEventListener('paste', impedirCopiaColagem);
    }
});

    //  LOGIN


document.addEventListener('DOMContentLoaded', function() {
    // Seleciona o input de senha
    const inputSenha = document.getElementById('senha');

    // Define a função que impede o evento de cópia
    function impedirCopia(event) {
        // Verifica se o evento é de cópia
        if (event.type === 'copy') {
            // Previne a ação padrão (copiar)
            event.preventDefault();
            
            // Opcional: Notificar o usuário sobre a restrição (utiliza a função 'notify' do seu código)
            // A função 'notify' deve estar definida em /js/notify.js
            if (typeof notify === 'function') {
                 notify("Restrição de segurança", 
                        "Por segurança, não é permitido copiar a senha deste campo.", 
                        "warning", "right top", 3000);
            }
        }
    }

    // Adiciona o listener para o evento 'copy' no campo de senha
    if (inputSenha) {
        inputSenha.addEventListener('copy', impedirCopia);
    }
    

});