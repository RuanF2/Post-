if (Auth.estaLogado()) {
  window.location.href = 'feed.html';
}

const form = document.getElementById('form-registro');
const btnCriar = document.getElementById('btn-criar');
const banner = document.getElementById('banner');
const campoNome = document.getElementById('field-nome');
const campoEmail = document.getElementById('field-email');
const campoSenha = document.getElementById('field-senha');

function limparErros() {
  [campoNome, campoEmail, campoSenha].forEach(c => c.classList.remove('has-error'));
  banner.classList.remove('is-visible', 'is-error', 'is-success');
}

function mostrarBanner(mensagem, tipo) {
  banner.textContent = mensagem;
  banner.classList.add('is-visible', tipo === 'erro' ? 'is-error' : 'is-success');
}

function setCarregando(carregando) {
  btnCriar.disabled = carregando;
  btnCriar.classList.toggle('is-loading', carregando);
}

form.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limparErros();

  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;

  let valido = true;
  if (!nome) { campoNome.classList.add('has-error'); valido = false; }
  if (!email || !email.includes('@')) { campoEmail.classList.add('has-error'); valido = false; }
  if (!senha || senha.length < 8) { campoSenha.classList.add('has-error'); valido = false; }
  if (!valido) return;

  setCarregando(true);

  try {
    await Api.registrar(nome, email, senha);
    mostrarBanner('Conta criada! Entrando…', 'sucesso');

    
    
    const loginResp = await Api.login(email, senha);
    Auth.salvarSessao(loginResp.token, { nome, email });
    setTimeout(() => { window.location.href = 'feed.html'; }, 500);
  } catch (erro) {
    mostrarBanner(erro.message, 'erro');
    setCarregando(false);
  }
});
