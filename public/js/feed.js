Auth.exigirLogin();

const usuario = Auth.getUsuario();
const postsContainer = document.getElementById('posts-container');
const composerTexto = document.getElementById('composer-texto');
const btnPublicar = document.getElementById('btn-publicar');

function preencherIdentidade() {
  const nome = usuario?.nome || 'Você';
  const iniciais = iniciaisDoNome(nome);

  document.getElementById('sidebar-nome').textContent = nome;
  document.getElementById('sidebar-avatar').textContent = iniciais;
  document.getElementById('composer-avatar').textContent = iniciais;
}
preencherIdentidade();

document.getElementById('link-logout').addEventListener('click', (e) => {
  e.preventDefault();
  Auth.logout();
});
document.getElementById('btn-logout-mobile').addEventListener('click', Auth.logout);

const switchEl = document.getElementById('network-switch');
const indicator = document.getElementById('switch-indicator');
const tabs = Array.from(switchEl.querySelectorAll('.network-tab'));

const NETWORK_THEME = {
  postplus: { bg: 'var(--accent-blue)' },
  tiktok: { bg: 'linear-gradient(135deg, #ff3b5c, #25f4ee)' },
  instagram: { bg: 'linear-gradient(135deg, #ffbe4d, #ff5f6d 45%, #a03cff)' },
};

function posicionarIndicador(tab, animar = true) {
  const largura = tab.offsetWidth;
  const x = tab.offsetLeft - 4; 
  switchEl.style.setProperty('--indicator-width', `${largura}px`);
  switchEl.style.setProperty('--indicator-x', `${x}px`);
  const tema = NETWORK_THEME[tab.dataset.network];
  indicator.style.background = tema.bg;
  if (!animar) indicator.style.transition = 'none';
  else indicator.style.transition = '';
}

function selecionarRede(nomeRede) {
  tabs.forEach(t => {
    const ativa = t.dataset.network === nomeRede;
    t.classList.toggle('is-active', ativa);
    t.setAttribute('aria-selected', ativa ? 'true' : 'false');
  });
  const tabAtiva = tabs.find(t => t.dataset.network === nomeRede);
  posicionarIndicador(tabAtiva);
  renderizarConteudoDaRede(nomeRede);
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => selecionarRede(tab.dataset.network));
});

window.addEventListener('load', () => posicionarIndicador(tabs[0], false));

composerTexto.addEventListener('input', () => {
  btnPublicar.disabled = composerTexto.value.trim().length === 0;
  composerTexto.style.height = 'auto';
  composerTexto.style.height = `${composerTexto.scrollHeight}px`;
});

btnPublicar.addEventListener('click', async () => {
  const conteudo = composerTexto.value.trim();
  if (!conteudo) return;

  btnPublicar.disabled = true;
  btnPublicar.textContent = 'Publicando…';

  try {
    const novoPost = await Api.criarPost(conteudo, null);
    composerTexto.value = '';
    composerTexto.style.height = 'auto';
    
    const card = criarCardDePost({ ...novoPost, autor_nome: usuario?.nome || usuario?.email });
    postsContainer.prepend(card);
    mostrarToast('Post publicado!', 'success');
  } catch (erro) {
    mostrarToast(erro.message, 'error');
  } finally {
    btnPublicar.textContent = 'Publicar';
    btnPublicar.disabled = composerTexto.value.trim().length === 0;
  }
});

function skeletonFeed(qtd = 3) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < qtd; i++) {
    const div = document.createElement('div');
    div.className = 'skeleton';
    frag.appendChild(div);
  }
  return frag;
}

async function carregarFeed() {
  postsContainer.innerHTML = '';
  postsContainer.appendChild(skeletonFeed());

  try {
    const posts = await Api.listarFeed();
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
      postsContainer.appendChild(estadoVazio(
        '✎',
        'Ainda não tem nada por aqui',
        'Seja a primeira pessoa a publicar algo no Post+.'
      ));
      return;
    }

    posts.forEach((post, indice) => {
      const card = criarCardDePost(post);
      card.style.animationDelay = `${Math.min(indice, 6) * 0.05}s`;
      postsContainer.appendChild(card);
    });
  } catch (erro) {
    postsContainer.innerHTML = '';
    mostrarToast(erro.message, 'error');
  }
}

function estadoVazio(icone, titulo, texto) {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <div class="icon-big">${icone}</div>
    <h3>${escaparHTML(titulo)}</h3>
    <p>${escaparHTML(texto)}</p>
  `;
  return div;
}

function criarCardDePost(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.dataset.postId = post.id;

  const ehAutor = usuario?.email && post.autor_nome === usuario.nome;
  const iniciais = iniciaisDoNome(post.autor_nome);

  card.innerHTML = `
    <div class="post-head">
      <div class="avatar" style="width:36px;height:36px;font-size:12.5px;">${iniciais}</div>
      <div>
        <div class="post-author">${escaparHTML(post.autor_nome || 'Alguém')}</div>
        <div class="post-time">${tempoRelativo(post.criado_em)}</div>
      </div>
    </div>
    <div class="post-content">${escaparHTML(post.conteudo)}</div>
    ${post.imagem_url ? `<div class="post-media"><img src="${escaparHTML(post.imagem_url)}" alt="" loading="lazy"></div>` : ''}
    <div class="post-actions">
      <button class="action-btn like-btn" data-role="like">
        <span class="icon">♡</span> <span data-role="like-count">curtir</span>
      </button>
      <button class="action-btn" data-role="toggle-comments">
        <span class="icon">✦</span> comentar
      </button>
      <button class="action-btn delete-btn" data-role="delete" style="margin-left:auto;">
        <span class="icon">✕</span>
      </button>
    </div>
    <div class="comments-wrap" data-role="comments-wrap">
      <div data-role="comments-list"></div>
      <form class="comment-form" data-role="comment-form">
        <input type="text" placeholder="Escreva um comentário…" data-role="comment-input" maxlength="500">
        <button type="submit" class="comment-send">Enviar</button>
      </form>
    </div>
  `;

  ligarEventosDoCard(card, post);
  atualizarContagemDeLikes(card, post.id);

  return card;
}

function ligarEventosDoCard(card, post) {
  const likeBtn = card.querySelector('[data-role="like"]');
  const toggleComentariosBtn = card.querySelector('[data-role="toggle-comments"]');
  const deleteBtn = card.querySelector('[data-role="delete"]');
  const comentariosWrap = card.querySelector('[data-role="comments-wrap"]');
  const comentarioForm = card.querySelector('[data-role="comment-form"]');
  const comentarioInput = card.querySelector('[data-role="comment-input"]');

  likeBtn.addEventListener('click', async () => {
    likeBtn.disabled = true;
    try {
      const resultado = await Api.toggleLike(post.id);
      likeBtn.classList.toggle('is-active', resultado.curtiu === 'true' || resultado.curtiu === true);
      await atualizarContagemDeLikes(card, post.id);
    } catch (erro) {
      mostrarToast(erro.message, 'error');
    } finally {
      likeBtn.disabled = false;
    }
  });

  let comentariosCarregados = false;
  toggleComentariosBtn.addEventListener('click', async () => {
    comentariosWrap.classList.toggle('is-open');
    if (comentariosWrap.classList.contains('is-open') && !comentariosCarregados) {
      comentariosCarregados = true;
      await carregarComentarios(card, post.id);
    }
  });

  comentarioForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const texto = comentarioInput.value.trim();
    if (!texto) return;

    const botao = comentarioForm.querySelector('.comment-send');
    botao.disabled = true;

    try {
      const novoComentario = await Api.criarComentario(post.id, texto);
      const lista = card.querySelector('[data-role="comments-list"]');
      lista.appendChild(criarLinhaDeComentario({ ...novoComentario, autor_nome: usuario?.nome || usuario?.email }));
      comentarioInput.value = '';
    } catch (erro) {
      mostrarToast(erro.message, 'error');
    } finally {
      botao.disabled = false;
    }
  });

  deleteBtn.addEventListener('click', async () => {
    if (!confirm('Apagar esse post?')) return;
    try {
      await Api.deletarPost(post.id);
      card.style.transition = 'opacity 0.25s, transform 0.25s';
      card.style.opacity = '0';
      card.style.transform = 'scale(0.97)';
      setTimeout(() => card.remove(), 220);
      mostrarToast('Post apagado', 'success');
    } catch (erro) {
      mostrarToast(erro.message, 'error');
    }
  });
}

async function atualizarContagemDeLikes(card, postId) {
  try {
    const resultado = await Api.contarLikes(postId);
    const span = card.querySelector('[data-role="like-count"]');
    const total = Number(resultado.count) || 0;
    span.textContent = total === 0 ? 'curtir' : `${total} curtida${total > 1 ? 's' : ''}`;
  } catch {
    
  }
}

async function carregarComentarios(card, postId) {
  const lista = card.querySelector('[data-role="comments-list"]');
  lista.innerHTML = '<div style="font-size:12.5px;color:var(--text-tertiary);">Carregando comentários…</div>';

  try {
    const comentarios = await Api.listarComentarios(postId);
    lista.innerHTML = '';
    if (comentarios.length === 0) {
      lista.innerHTML = '<div style="font-size:12.5px;color:var(--text-tertiary);">Nenhum comentário ainda. Seja a primeira pessoa.</div>';
      return;
    }
    comentarios.forEach(c => lista.appendChild(criarLinhaDeComentario(c)));
  } catch (erro) {
    lista.innerHTML = '';
    mostrarToast(erro.message, 'error');
  }
}

function criarLinhaDeComentario(comentario) {
  const row = document.createElement('div');
  row.className = 'comment-row';
  row.innerHTML = `
    <div class="avatar" style="width:28px;height:28px;font-size:10.5px;flex-shrink:0;">${iniciaisDoNome(comentario.autor_nome)}</div>
    <div class="comment-bubble">
      <div class="comment-author">${escaparHTML(comentario.autor_nome || 'Alguém')}</div>
      <div class="comment-text">${escaparHTML(comentario.conteudo)}</div>
    </div>
  `;
  return row;
}

function renderizarConteudoDaRede(rede) {
  document.getElementById('composer').style.display = rede === 'postplus' ? 'flex' : 'none';

  if (rede === 'postplus') {
    carregarFeed();
    return;
  }

  const nomes = { tiktok: 'TikTok', instagram: 'Instagram' };
  const icones = { tiktok: '♪', instagram: '◈' };

  postsContainer.innerHTML = '';
  postsContainer.appendChild(estadoVazio(
    icones[rede],
    `Conecte sua conta do ${nomes[rede]}`,
    `Em breve você vai poder ver aqui, dentro do Post+, o que você publica no ${nomes[rede]} — sem precisar trocar de app.`
  ));
}

carregarFeed();
