if (Auth.estaLogado()) {
  window.location.href = 'feed.html';
}

const form = document.getElementById('form-login');
const btnEntrar = document.getElementById('btn-entrar');
const banner = document.getElementById('banner');
const campoEmail = document.getElementById('field-email');
const campoSenha = document.getElementById('field-senha');

function limparErros() {
  campoEmail.classList.remove('has-error');
  campoSenha.classList.remove('has-error');
  banner.classList.remove('is-visible', 'is-error', 'is-success');
}

function mostrarBanner(mensagem, tipo) {
  banner.textContent = mensagem;
  banner.classList.add('is-visible', tipo === 'erro' ? 'is-error' : 'is-success');
}

function setCarregando(carregando) {
  btnEntrar.disabled = carregando;
  btnEntrar.classList.toggle('is-loading', carregando);
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparErros();

  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  let valido = true;
  if (!email || !email.includes('@')) {
    campoEmail.classList.add('has-error');
    valido = false;
  }
  if (!senha) {
    campoSenha.classList.add('has-error');
    valido = false;
  }
  if (!valido) return;

  setCarregando(true);

  try {
    const resposta = await Api.login(email, senha);
    
    
    Auth.salvarSessao(resposta.token, { email });
    mostrarBanner('Login realizado! Te levando pro feed…', 'sucesso');
    setTimeout(() => { window.location.href = 'feed.html'; }, 500);
  } catch (erro) {
    mostrarBanner(erro.message, 'erro');
    setCarregando(false);
  }
});
