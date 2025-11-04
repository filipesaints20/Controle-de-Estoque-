🛠️ Catálogo de Preços PRO

Sistema simples e eficiente para gerenciar um catálogo de materiais, serviços e valores unitários — tudo direto do navegador e sincronizado com o Google Sheets (BDA).

🚀 Funcionalidades

✅ Adicionar, editar e remover itens do catálogo.
✅ Edição rápida de valores por duplo clique.
✅ Exportar e importar dados via CSV.
✅ Sincronização automática com Google Sheets.
✅ Interface moderna, leve e responsiva.
✅ Persistência de dados online (substitui o localStorage local).

🧩 Estrutura de Arquivos
📂 catalogo-pro
 ├── index.html      → Estrutura principal do app
 ├── style.css       → Estilos e layout
 ├── script.js       → Lógica e integração com Google Sheets
 └── README.md       → Este guia

⚙️ Requisitos

Navegador moderno (Chrome, Edge, Firefox, etc.)

Uma conta Google (para usar o Google Sheets)

Conexão com a internet (para salvar e carregar dados no Sheets)

📄 Configuração do Google Sheets (BDA)
1️⃣ Criar a planilha

Acesse https://sheets.new

Nomeie a planilha como Catálogo PRO

Crie as colunas:

Categoria | Nome | Descricao | Preco

2️⃣ Criar o script Google Apps Script

Na planilha, vá em Extensões → Apps Script

Apague tudo e cole o código abaixo:

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Página1');
  const data = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Página1');
  const body = JSON.parse(e.postData.contents);
  sheet.clearContents(); // limpa antes de atualizar tudo
  const header = ["Categoria", "Nome", "Descricao", "Preco"];
  const values = [header, ...body.map(r => [r.categoria, r.nome, r.descricao, r.preco])];
  sheet.getRange(1, 1, values.length, 4).setValues(values);
  return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.TEXT);
}


Clique em Implantar → Nova implantação

Tipo: Aplicativo da Web

Acesso: “Qualquer pessoa com o link”

Copie a URL gerada (exemplo:
https://script.google.com/macros/s/AKfycbxyz12345/exec)

3️⃣ Vincular ao projeto

No arquivo script.js, localize esta linha:

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/SEU_SCRIPT_ID_AQUI/exec';


Substitua pela URL que você copiou do Apps Script.

🧠 Como Usar

Abra o arquivo index.html no navegador.

Adicione novos itens ao catálogo e clique em “Adicionar à Lista”.

O sistema salvará automaticamente os dados no seu Google Sheets.

Para editar um preço rapidamente, dê duplo clique sobre ele.

Para exportar ou importar planilhas, use a aba 📥 Importar/Exportar CSV.

🧰 Tecnologias Utilizadas

HTML5

CSS3 (Grid e Flexbox)

JavaScript Puro (Vanilla JS)

Google Apps Script (API REST para Google Sheets)

📦 Publicação Online (opcional)

Você pode hospedar o projeto de forma gratuita:

GitHub Pages → basta enviar os arquivos e ativar o Pages.

Netlify ou Vercel → faça deploy direto arrastando a pasta.

🧑‍💻 Autor

Desenvolvido por Daniel e Filipe 💡
Sistema de apoio à gestão de preços e orçamentos com integração a planilha online.

📜 Licença

Este projeto é de uso livre para fins pessoais, educacionais ou empresariais.
Créditos são sempre bem-vindos. 🙌
