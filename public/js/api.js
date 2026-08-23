const API_BASE = 'http://localhost:3000/api';

const Auth = {
  salvarSessao(token, usuario) {
    localStorage.setItem('postplus_token', token);
    localStorage.setItem('postplus_usuario', JSON.stringify(usuario));
  },
  getToken() {
    return localStorage.getItem('postplus_token');
  },
  getUsuario() {
    const bruto = localStorage.getItem('postplus_usuario');
    return bruto ? JSON.parse(bruto) : null;
  },
  estaLogado() {
    return !!this.getToken();
  },
  logout() {
    localStorage.removeItem('postplus_token');
    localStorage.removeItem('postplus_usuario');
    window.location.href = 'login.html';
  },
  
  exigirLogin() {
    if (!this.estaLogado()) {
      window.location.href = 'login.html';
    }
  },
};

async function apiRequest(caminho, { method = 'GET', body, autenticado = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  if (autenticado) {
    const token = Auth.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const resposta = await fetch(`${API_BASE}${caminho}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  
  const texto = await resposta.text();
  const dados = texto ? JSON.parse(texto) : null;

  if (!resposta.ok) {
    const mensagem = (dados && dados.mensagem) || 'Algo deu errado. Tenta de novo.';
    const erro = new Error(mensagem);
    erro.status = resposta.status;
    throw erro;
  }

  return dados;
}

const Api = {
  
  registrar(nome, email, senha) {
    return apiRequest('/auth/register', { method: 'POST', body: { nome, email, senha }, autenticado: false });
  },
  login(email, senha) {
    return apiRequest('/auth/login', { method: 'POST', body: { email, senha }, autenticado: false });
  },

  
  criarPost(conteudo, imagem_url) {
    return apiRequest('/posts', { method: 'POST', body: { conteudo, imagem_url } });
  },
  listarFeed() {
    return apiRequest('/posts/feed');
  },
  listarPostsDeUsuario(userId) {
    return apiRequest(`/posts/usuario/${userId}`);
  },
  deletarPost(id) {
    return apiRequest(`/posts/${id}`, { method: 'DELETE' });
  },

  
  listarComentarios(postId) {
    return apiRequest(`/comments/post/${postId}`);
  },
  criarComentario(postId, conteudo) {
    return apiRequest(`/comments/post/${postId}`, { method: 'POST', body: { conteudo } });
  },
  deletarComentario(id) {
    return apiRequest(`/comments/${id}`, { method: 'DELETE' });
  },

  
  toggleLike(postId) {
    return apiRequest(`/likes/post/${postId}`, { method: 'POST' });
  },
  contarLikes(postId) {
    return apiRequest(`/likes/post/${postId}/contagem`, { autenticado: false });
  },

  
  toggleFollow(followingId) {
    return apiRequest(`/follows/${followingId}`, { method: 'POST' });
  },
  listarSeguidores(userId) {
    return apiRequest(`/follows/${userId}/seguidores`, { autenticado: false });
  },
  listarSeguindo(userId) {
    return apiRequest(`/follows/${userId}/seguindo`, { autenticado: false });
  },
};

function mostrarToast(mensagem, tipo = 'success') {
  let host = document.querySelector('.toast-host');
  if (!host) {
    host = document.createElement('div');
    host.className = 'toast-host';
    document.body.appendChild(host);
  }
  const toast = document.createElement('div');
  toast.className = `toast is-${tipo}`;
  toast.textContent = mensagem;
  host.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

function iniciaisDoNome(nome) {
  if (!nome) return '?';
  const partes = nome.trim().split(' ');
  const primeira = partes[0]?.[0] || '';
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : '';
  return (primeira + ultima).toUpperCase();
}

function tempoRelativo(dataISO) {
  const agora = new Date();
  const data = new Date(dataISO);
  const diffMs = agora - data;
  const diffMin = Math.floor(diffMs / 60000);

  if (diffMin < 1) return 'agora';
  if (diffMin < 60) return `${diffMin}min`;
  const diffHoras = Math.floor(diffMin / 60);
  if (diffHoras < 24) return `${diffHoras}h`;
  const diffDias = Math.floor(diffHoras / 24);
  if (diffDias < 7) return `${diffDias}d`;
  return data.toLocaleDateString('pt-BR');
}

function escaparHTML(texto) {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
}
