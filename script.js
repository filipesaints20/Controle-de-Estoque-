const TBODY = document.querySelector('#catalogoTabela tbody');
const DATALIST = document.getElementById('itens-existentes');
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwpclELlpaVCg4MIxKnSlfs9c52usm3NEtdj-a-r5gFYIoARxo6qXjoT2_jFnYKc4FMwg/exec'; // 🔗 substitua pela sua URL

let dataBase = [];
let itemParaAtualizar = null;

document.addEventListener('DOMContentLoaded', async () => {
  await carregarDoSheets();
  renderizarTabela();
  atualizarDatalist();
});

// === Google Sheets ===
async function carregarDoSheets() {
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    dataBase = data.slice(1).map(r => ({
      categoria: r[0],
      nome: r[1],
      descricao: r[2],
      preco: parseFloat(r[3])
    }));
  } catch (err) {
    console.error('Erro ao carregar:', err);
  }
}

async function persistirDados() {
  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(dataBase),
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('✅ Dados salvos no Google Sheets.');
  } catch (err) {
    console.error('Erro ao salvar:', err);
  }
}

// === Funções principais ===
function formatarMoeda(valor) {
  return parseFloat(valor||0).toFixed(2).replace('.', ',');
}

function renderizarTabela() {
  TBODY.innerHTML = '';
  dataBase.forEach((item, index) => {
    const linha = TBODY.insertRow();
    linha.setAttribute('data-index', index);
    linha.insertCell(0).innerText = item.categoria;
    linha.insertCell(1).innerText = item.nome;
    linha.insertCell(2).innerText = item.descricao;
    const precoCell = linha.insertCell(3);
    precoCell.className = 'editable';
    precoCell.innerText = formatarMoeda(item.preco);
    linha.insertCell(4).innerHTML = `<button class="remover-btn" onclick="removerLinha(${index})">Remover</button>`;
  });
  document.querySelectorAll('.editable').forEach(c => adicionarListenerEdicao(c));
}

function atualizarDatalist() {
  DATALIST.innerHTML = '';
  dataBase.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item.nome;
    DATALIST.appendChild(opt);
  });
}

function adicionarListenerEdicao(cell) {
  cell.addEventListener('dblclick', function() {
    const linha = this.parentNode;
    const index = parseInt(linha.getAttribute('data-index'));
    const originalValue = dataBase[index].preco.toFixed(2);
    const input = document.createElement('input');
    input.type = 'number'; input.step = '0.01'; input.value = originalValue;
    this.innerText = ''; this.appendChild(input); input.focus();
    input.addEventListener('blur', async () => {
      let novo = parseFloat(input.value);
      if (isNaN(novo)) novo = dataBase[index].preco;
      dataBase[index].preco = novo;
      this.innerText = formatarMoeda(novo);
      await persistirDados();
    });
  });
}

function removerLinha(index) {
  if (confirm(`Remover "${dataBase[index].nome}"?`)) {
    dataBase.splice(index, 1);
    persistirDados();
    renderizarTabela();
    atualizarDatalist();
  }
}

document.getElementById('form-insercao').addEventListener('submit', async e => {
  e.preventDefault();
  const nome = document.getElementById('nomeItemInput').value.trim();
  const preco = parseFloat(document.getElementById('valorItemInput').value);
  const categoria = document.getElementById('categoria').value;
  const descricao = document.getElementById('descricaoItemInput').value.trim();

  if (!nome || isNaN(preco)) return alert('Preencha nome e preço!');

  const novoItem = { categoria, nome, descricao, preco };
  const existente = dataBase.findIndex(i => i.nome.toUpperCase() === nome.toUpperCase());

  if (existente !== -1) {
    if (confirm('Item já existe. Deseja atualizar?')) {
      dataBase[existente] = novoItem;
    }
  } else {
    dataBase.push(novoItem);
  }

  await persistirDados();
  renderizarTabela();
  atualizarDatalist();
  e.target.reset();
});

function openTab(evt, tabName) {
  document.querySelectorAll('.tab-content').forEach(c => c.style.display = 'none');
  document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
  document.getElementById(tabName).style.display = 'block';
  evt.currentTarget.classList.add('active');
}
