/* ============================================================
   CONTATO.JS — comportamentos específicos da página de contato
   ============================================================ */

// ─── FILE DROP ────────────────────────────────────────────────
(function initFileDrop() {
  const drop  = document.getElementById('fileDrop');
  const input = document.getElementById('arquivo');
  if (!drop || !input) return;

  drop.addEventListener('click', (e) => {
    if (!e.target.classList.contains('file-drop-label')) input.click();
  });

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) showFile(file.name);
  });

  drop.addEventListener('dragover', (e) => {
    e.preventDefault();
    drop.style.borderColor = 'var(--gold)';
    drop.style.background  = 'var(--gold-dim)';
  });

  drop.addEventListener('dragleave', () => {
    drop.style.borderColor = '';
    drop.style.background  = '';
  });

  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    drop.style.borderColor = '';
    drop.style.background  = '';
    
    const file = e.dataTransfer.files[0];
    if (file) {
      try {
        const dt = new DataTransfer();
        dt.items.add(file);
        input.files = dt.files;
        showFile(file.name);
      } catch (error) {
        // Fallback para browsers legados ou Safari iOS antigo
        const p = drop.querySelector('p');
        if (p) {
          p.innerHTML = `<span style="color:var(--red)">Função de arrastar não suportada. <label for="arquivo" class="file-drop-label">Clique para selecionar</label>.</span>`;
        }
      }
    }
  });

  function showFile(name) {
    const p = drop.querySelector('p');
    if (p) {
      p.innerHTML = `<strong style="color:var(--gold)">${name}</strong> selecionado`;
    }
    drop.style.borderColor = 'var(--gold-line)';
  }
})();

// ─── MODAL DE ALERTA ──────────────────────────────────────────
const modal            = document.getElementById('customModal');
const modalCloseBtn    = document.getElementById('modalCloseBtn');
const modalTitle       = document.getElementById('modalTitle');
const modalDesc        = document.getElementById('modalDesc');
const modalIconSuccess = document.getElementById('modalIconSuccess');
const modalIconError   = document.getElementById('modalIconError');

function showModal(title, desc, isError = false) {
  if (!modal || !modalTitle || !modalDesc || !modalCloseBtn) return;

  modalTitle.innerText = title;
  modalDesc.innerText  = desc;

  if (isError) {
    if (modalIconSuccess) modalIconSuccess.style.display = 'none';
    if (modalIconError)   modalIconError.style.display   = 'block';
    modalCloseBtn.style.background = '#e05252';
  } else {
    if (modalIconSuccess) modalIconSuccess.style.display = 'block';
    if (modalIconError)   modalIconError.style.display   = 'none';
    modalCloseBtn.style.background = '';
  }

  modal.classList.add('active');
}

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', () => {
    if (modal) modal.classList.remove('active');
    modalCloseBtn.style.background = '';
  });
}

if (modal) {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      if (modalCloseBtn) modalCloseBtn.style.background = '';
    }
  });
}

// ─── MÁSCARA DE TELEFONE ──────────────────────────────────────
const telefone = document.getElementById('telefone');

if (telefone) {
  telefone.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');

    if (valor.length === 0) {
      e.target.value = '';
      return;
    }

    if (valor.length > 11) valor = valor.slice(0, 11);

    if (valor.length > 10) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length > 6) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else if (valor.length > 2) {
      valor = valor.replace(/^(\d{2})(\d{1,4})/, '($1) $2');
    } else {
      valor = valor.replace(/^(\d{1,2})/, '($1');
    }

    e.target.value = valor;
  });
}

// ─── ENVIO DO FORMULÁRIO (VIA IFRAME OCULTO) ──────────────────
const form   = document.getElementById('contatoForm');
const iframe = document.getElementById('hidden_iframe');
const btn    = document.getElementById('submitBtn');

if (form && iframe && btn) {
  // Substituímos o booleano por um controle de timestamp
  let submitTimestamp = null;

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }

    // Registra o momento exato do envio
    submitTimestamp = Date.now();
    btn.textContent = 'Enviando…';
    btn.disabled = true;
  });

  iframe.addEventListener('load', function () {
    // Se não houver timestamp de envio, ignora o load (previne disparos por cache/inicialização)
    if (!submitTimestamp) return;

    // Reseta o timestamp imediatamente para invalidar carregamentos subsequentes inesperados
    submitTimestamp = null;

    btn.textContent = '✓ Solicitação enviada!';
    btn.style.background = '#2d7a3a';

    showModal(
      'Solicitação Enviada!',
      'Recebemos seus dados e o arquivo do projeto. Entraremos em contato em breve para dar andamento ao orçamento.'
    );

    form.reset();

    setTimeout(() => {
      btn.textContent = 'Enviar Solicitação de Orçamento';
      btn.disabled = false;
      btn.style.background = '';
    }, 4000);

    const dropP = document.querySelector('#fileDrop p');
    if (dropP) {
      dropP.innerHTML = `Arraste o arquivo aqui ou <label for="arquivo" class="file-drop-label">clique para selecionar</label>`;
    }

    const fileDrop = document.getElementById('fileDrop');
    if (fileDrop) {
      fileDrop.style.borderColor = '';
      fileDrop.style.background  = '';
    }
  });
}