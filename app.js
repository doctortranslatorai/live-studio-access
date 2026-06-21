function showToast(message){
  let toast = document.getElementById('toast');
  if(!toast){
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove('show'), 2300);
}

document.querySelectorAll('[data-toast]').forEach(btn => {
  btn.addEventListener('click', () => showToast(btn.dataset.toast));
});

const accessForm = document.getElementById('accessForm');
if(accessForm){
  accessForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(accessForm).entries());
    localStorage.setItem('liveStudioApplication', JSON.stringify({
      ...data,
      sentAt: new Date().toISOString()
    }));
    showToast('Pedido guardado localmente. Próximo passo: ligar a backend real.');
    setTimeout(() => window.location.href = 'studio.html', 900);
  });
}

const savedBox = document.getElementById('savedApplication');
if(savedBox){
  const saved = localStorage.getItem('liveStudioApplication');
  if(saved){
    const data = JSON.parse(saved);
    savedBox.innerHTML = `
      <div class="status-item"><span>Nome</span><span class="status ok">${data.name || 'Criador'}</span></div>
      <div class="status-item"><span>Categoria</span><span class="status">${data.category || 'Gaming'}</span></div>
      <div class="status-item"><span>Estado</span><span class="status warn">Em análise</span></div>
    `;
  }
}

const clearBtn = document.getElementById('clearApplication');
if(clearBtn){
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('liveStudioApplication');
    showToast('Dados locais removidos.');
    setTimeout(() => location.reload(), 700);
  });
}
