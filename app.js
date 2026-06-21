const lives = [
  {id:1, title:'Ranked Night: só vitórias ou drama', creator:'NunoPlay', avatar:'NP', category:'Gaming', viewers:2384, thumb:'alt1', desc:'Competitivo, chat aberto e desafios em tempo real.'},
  {id:2, title:'Música ao vivo sem filtros', creator:'LiaVibes', avatar:'LV', category:'Música', viewers:918, thumb:'alt2', desc:'Voz, piano e pedidos do público.'},
  {id:3, title:'Conversa da madrugada', creator:'MartaTalks', avatar:'MT', category:'Conversa', viewers:612, thumb:'alt3', desc:'Temas reais, histórias e comunidade.'},
  {id:4, title:'Ofertas em direto — tech barato', creator:'LiveShop PT', avatar:'LS', category:'Vendas', viewers:1406, thumb:'', desc:'Produtos em destaque e perguntas ao vivo.'},
  {id:5, title:'IA para criar conteúdo viral', creator:'Pedro AI', avatar:'PA', category:'Educação', viewers:772, thumb:'alt2', desc:'Ferramentas, prompts e exemplos práticos.'},
  {id:6, title:'Batalha de DJs neon', creator:'DJ Aurora', avatar:'DA', category:'Música', viewers:3321, thumb:'alt1', desc:'Set eletrônico com votação do público.'}
];

function qs(name){
  const params = new URLSearchParams(location.search);
  return params.get(name);
}

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

function liveCard(live){
  return `
    <article class="panel live-card" data-category="${live.category}">
      <a href="live.html?id=${live.id}" class="thumb ${live.thumb}">
        <div class="live-tag"><span class="pulse"></span> LIVE</div>
        <div class="viewer-tag">👁 ${live.viewers.toLocaleString('pt-PT')}</div>
        <div class="visual-orb"></div>
        <div class="thumb-title">
          <span class="badge">${live.category}</span>
        </div>
      </a>
      <div class="live-body">
        <div class="creator-line">
          <div class="mini-avatar">${live.avatar}</div>
          <div>
            <h3>${live.title}</h3>
            <p>@${live.creator} · ${live.desc}</p>
          </div>
        </div>
        <div class="live-actions">
          <a class="btn btn-primary" href="live.html?id=${live.id}">Entrar ao vivo</a>
          <button class="btn" data-follow="${live.creator}">Seguir</button>
        </div>
      </div>
    </article>
  `;
}

function renderLives(category='Todas'){
  const grid = document.getElementById('liveGrid');
  if(!grid) return;
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem('liveloopLives') || '[]'); } catch(e){}
  const allLives = [...custom, ...lives];
  const filtered = category === 'Todas' ? allLives : allLives.filter(l => l.category === category);
  grid.innerHTML = filtered.map(liveCard).join('');
  bindFollowButtons();
}

function bindFollowButtons(){
  document.querySelectorAll('[data-follow]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const name = btn.dataset.follow;
      btn.textContent = 'A seguir';
      btn.classList.add('btn-cyan');
      showToast(`Agora estás a seguir ${name}.`);
    });
  });
}

document.querySelectorAll('[data-category]').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('[data-category]').forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    renderLives(tab.dataset.category);
  });
});

renderLives();

document.querySelectorAll('[data-toast]').forEach(btn=>{
  btn.addEventListener('click',()=>showToast(btn.dataset.toast));
});

const createForm = document.getElementById('createLiveForm');
if(createForm){
  createForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const data = Object.fromEntries(new FormData(createForm).entries());
    const live = {
      id: Date.now(),
      title: data.title || 'Nova live',
      creator: data.creator || 'Criador',
      avatar: (data.creator || 'CL').slice(0,2).toUpperCase(),
      category: data.category || 'Conversa',
      viewers: Math.floor(Math.random()*800)+80,
      thumb: ['','alt1','alt2','alt3'][Math.floor(Math.random()*4)],
      desc: data.description || 'Live criada pela comunidade.'
    };
    const stored = JSON.parse(localStorage.getItem('liveloopLives') || '[]');
    stored.unshift(live);
    localStorage.setItem('liveloopLives', JSON.stringify(stored));
    showToast('Live criada localmente. A abrir sala...');
    setTimeout(()=>location.href=`live.html?id=${live.id}`,900);
  });
}

const liveRoom = document.getElementById('liveRoomTitle');
if(liveRoom){
  const id = Number(qs('id') || 1);
  let custom = [];
  try { custom = JSON.parse(localStorage.getItem('liveloopLives') || '[]'); } catch(e){}
  const allLives = [...custom, ...lives];
  const live = allLives.find(l => Number(l.id) === id) || allLives[0];
  document.getElementById('liveRoomTitle').textContent = live.title;
  document.getElementById('liveRoomCreator').textContent = '@' + live.creator;
  document.getElementById('liveRoomCategory').textContent = live.category;
  document.getElementById('liveRoomViewers').textContent = live.viewers.toLocaleString('pt-PT') + ' ao vivo';
}

const chatForm = document.getElementById('chatForm');
if(chatForm){
  chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = document.getElementById('chatText');
    if(!input.value.trim()) return;
    const box = document.getElementById('chatMessages');
    const div = document.createElement('div');
    div.className = 'chat-bubble';
    div.innerHTML = `<strong>Tu:</strong> ${input.value}`;
    box.appendChild(div);
    input.value = '';
    box.scrollTop = box.scrollHeight;
  });
}

const messageForm = document.getElementById('messageForm');
if(messageForm){
  messageForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const input = document.getElementById('messageText');
    if(!input.value.trim()) return;
    const body = document.getElementById('conversationBody');
    const div = document.createElement('div');
    div.className = 'dm me';
    div.textContent = input.value;
    body.appendChild(div);
    input.value = '';
    showToast('Mensagem enviada no modo mockup.');
  });
}
