document.addEventListener("DOMContentLoaded", function () {

    // TOGGLE SENHA - usa os botões que existem no HTML atual
    const senhaInput = document.getElementById("senha");
    const repsenhaInput = document.getElementById("repsenha");

    // Impedir copiar/colar nas senhas
    function impedirCopiaColagem(event) {
        event.preventDefault();
        if (typeof notify === 'function') {
            notify("Restrição de segurança",
                "Por segurança, a digitação da senha é obrigatória. Não é permitido copiar ou colar.",
                "warning", "right bottom", 3000);
        }
        event.target.focus();
    }

    if (senhaInput) {
        senhaInput.addEventListener('copy', impedirCopiaColagem);
        senhaInput.addEventListener('paste', impedirCopiaColagem);
    }

    if (repsenhaInput) {
        repsenhaInput.addEventListener('copy', impedirCopiaColagem);
        repsenhaInput.addEventListener('paste', impedirCopiaColagem);
    }

    // VALIDADOR DE SENHA EM TEMPO REAL
    if (senhaInput) {
        senhaInput.addEventListener('input', function () {
            const senha = this.value;
            const regras = {
                'req-tamanho':   senha.length >= 8,
                'req-numero':    /\d/.test(senha),
                'req-minuscula': /[a-z]/.test(senha),
                'req-simbolo':   /[@#$%^&*!]/.test(senha),
                'req-maiuscula': /[A-Z]/.test(senha),
            };
            Object.entries(regras).forEach(([id, valido]) => {
                const el = document.getElementById(id);
                if (el) {
                    el.style.color = valido ? '#22c55e' : '';
                    el.querySelector('i').style.color = valido ? '#22c55e' : '';
                }
            });
        });
    }

}); 