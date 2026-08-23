Auth.exigirLogin();

const usuario = Auth.getUsuario();
const postsContainer = document.getElementById('posts-container');

function preencherIdentidade() {
  const nome = usuario?.nome || 'Você';
  const iniciais = iniciaisDoNome(nome);

  document.getElementById('sidebar-nome').textContent = nome;
  document.getElementById('sidebar-avatar').textContent = iniciais;
  document.getElementById('profile-avatar').textContent = iniciais;
  document.getElementById('profile-nome').textContent = nome;
  document.getElementById('profile-email').textContent = usuario?.email || '—';
}
preencherIdentidade();

document.getElementById('link-logout').addEventListener('click', (e) => {
  e.preventDefault();
  Auth.logout();
});
document.getElementById('btn-logout-mobile').addEventListener('click', Auth.logout);

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

function criarCardSimples(post) {
  const card = document.createElement('article');
  card.className = 'post-card';
  card.innerHTML = `
    <div class="post-head">
      <div class="avatar" style="width:36px;height:36px;font-size:12.5px;">${iniciaisDoNome(post.autor_nome)}</div>
      <div>
        <div class="post-author">${escaparHTML(post.autor_nome || 'Você')}</div>
        <div class="post-time">${tempoRelativo(post.criado_em)}</div>
      </div>
    </div>
    <div class="post-content">${escaparHTML(post.conteudo)}</div>
  `;
  return card;
}

async function carregarPerfil() {
  
  
  
  
  postsContainer.innerHTML = '';
  const skeleton = document.createElement('div');
  skeleton.className = 'skeleton';
  postsContainer.appendChild(skeleton);

  try {
    const todosOsPosts = await Api.listarFeed();
    const meusPosts = todosOsPosts.filter(p => p.autor_nome === usuario?.nome);

    document.getElementById('stat-posts').textContent = meusPosts.length;

    postsContainer.innerHTML = '';

    if (meusPosts.length === 0) {
      postsContainer.appendChild(estadoVazio('✎', 'Nenhum post ainda', 'Quando você publicar algo, ele aparece aqui.'));
      return;
    }

    meusPosts.forEach(post => postsContainer.appendChild(criarCardSimples(post)));
  } catch (erro) {
    postsContainer.innerHTML = '';
    mostrarToast(erro.message, 'error');
  }
}

carregarPerfil();
