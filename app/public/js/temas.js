function toggleMenu() {
    document.querySelector('.navnavbar').classList.toggle('ativo');
  }

  function toggleTema() {
    const html = document.documentElement;
    const icone = document.getElementById('tema-icone');
    const temaAtual = html.getAttribute('data-tema');

    if (temaAtual === 'claro') {
      html.removeAttribute('data-tema');
      icone.textContent = '☀️';
      localStorage.setItem('tema', 'escuro');
    } else {
      html.setAttribute('data-tema', 'claro');
      icone.textContent = '🌙';
      localStorage.setItem('tema', 'claro');
    }
  }
  (function() {
    const temaSalvo = localStorage.getItem('tema');
    if (temaSalvo === 'claro') {
      document.documentElement.setAttribute('data-tema', 'claro');
      const icone = document.getElementById('tema-icone');
      if (icone) icone.textContent = '🌙';
    }
  })();