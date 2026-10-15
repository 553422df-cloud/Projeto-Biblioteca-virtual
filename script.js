/*
  =====================================================================
  MINHA BIBLIOTECA — script.js
  =====================================================================
  A IDEIA GERAL:
    - Os livros ficam guardados no arquivo livros.json.
    - Quando a página abre, ela PEDE a lista ao servidor (carregarLivros).
    - Quando adicionamos, excluímos ou favoritamos, a página muda a lista
      e MANDA a lista inteira de volta para o servidor gravar (salvarLivros).
    - Sempre que algo muda, renderizarAcervo() desenha a estante de novo.

  ORDEM: 1 Dados | 2 Elementos | 3 Servidor | 4 Desenhar a estante |
         5 Janela de detalhes | 6 Categorias e busca | 7 Adicionar | 8 Excluir | 9 Favoritar | 10 Começar
*/


// =====================================================================
// 1) DADOS: o que a página "lembra"
// =====================================================================
let livros = [];                 // a lista de livros (vem do livros.json)
let categoriaAtiva = "Todas";    // categoria escolhida ("Todas" = mostra tudo)
let livroSelecionado = null;     // o livro aberto na janela de detalhes

const cores = ["#234b70", "#6e3928", "#283b36", "#9b7845", "#81502b", "#254c62", "#59633c"];   // cores das capas


// =====================================================================
// 2) ELEMENTOS DA PÁGINA (pegos pelo id que está no HTML)
// =====================================================================
// --- estante e controles ---
const bookshelf = document.querySelector("#bookshelf");               // onde os livros são desenhados
const categoryGrid = document.querySelector("#category-grid");        // os botões de categoria
const searchForm = document.querySelector("#search-form");            // a barra de busca
const searchInput = document.querySelector("#search-input");          // o campo de busca
const sortSelect = document.querySelector("#sort-select");            // o menu "Ordenar por"
const collectionTitle = document.querySelector("#collection-title");  // "Estante: ..."
const resultsCount = document.querySelector("#results-count");        // "X livros encontrados"
const emptyState = document.querySelector("#empty-state");            // "Nenhum livro encontrado"
const addStatus = document.querySelector("#add-status");              // avisos ("foi adicionado", "foi excluído")

// --- janela de detalhes ---
const dialog = document.querySelector("#book-dialog");
const dialogCover = document.querySelector("#dialog-cover");
const dialogTitle = document.querySelector("#dialog-title");
const dialogAuthor = document.querySelector("#dialog-author");
const dialogCategory = document.querySelector("#dialog-category");
const dialogSynopsis = document.querySelector("#dialog-synopsis");
const dialogHelp = document.querySelector("#dialog-help");
const readLink = document.querySelector("#read-link");                // "Ler agora"
const favoriteButton = document.querySelector("#favorite-button");    // "Adicionar aos favoritos"
const deleteButton = document.querySelector("#delete-button");        // "Excluir livro"

// --- janela "Adicionar livro" ---
const addButton = document.querySelector("#add-book-button");         // "+ Adicionar livro"
const addDialog = document.querySelector("#add-dialog");              // a janela do formulário
const addForm = document.querySelector("#add-form");                  // o formulário
const addMessage = document.querySelector("#add-message");            // aviso de erro do formulário
const cancelAdd = document.querySelector("#cancel-add");              // "Cancelar"


// =====================================================================
// 3) CONVERSAR COM O SERVIDOR (ler e gravar o livros.json)
// =====================================================================
// fetch = "buscar": faz um pedido ao servidor.
// await = "espere a resposta chegar antes de continuar" (só funciona dentro de função async).

// carregarLivros: pede a lista ao servidor e desenha a estante
async function carregarLivros() {
  const resposta = await fetch("/livros");   // pede: "me dá os livros"
  livros = await resposta.json();            // transforma a resposta (texto) em lista
  renderizarAcervo();
}

// salvarLivros: manda a lista inteira para o servidor gravar no livros.json
async function salvarLivros() {
  await fetch("/livros", {
    method: "POST",                                     // POST = "estou mandando dados"
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(livros)                        // lista -> texto
  });
}


// =====================================================================
// 4) DESENHAR A ESTANTE
// =====================================================================

// criarLivro: cria o botão de UM livro (capa colorida + legenda)
function criarLivro(livro) {
  const capa = document.createElement("span");
  capa.className = "book-cover";
  capa.style.background = livro.cor;
  capa.innerHTML = `<span class="cover-ornament">✦</span>`;   // a estrelinha (texto fixo, sem dados do usuário)
  capa.append(criarTexto("span", "cover-title", livro.titulo), criarTexto("span", "cover-author", livro.autor));

  const legenda = document.createElement("span");
  legenda.className = "book-caption";
  legenda.append(criarTexto("strong", "", livro.titulo), criarTexto("span", "", livro.autor));

  const botao = document.createElement("button");
  botao.className = "book";
  botao.type = "button";
  botao.append(capa, legenda);
  botao.addEventListener("click", () => abrirDetalhes(livro));   // clicar no livro abre os detalhes
  return botao;
}

// criarTexto: cria um elemento com classe e texto.
// Usamos textContent (e não innerHTML) para o texto digitado nunca virar código HTML.
function criarTexto(tag, classe, texto) {
  const elemento = document.createElement(tag);
  elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

// renderizarAcervo: A FUNÇÃO PRINCIPAL. Filtra, ordena e desenha os livros.
function renderizarAcervo() {
  const busca = searchInput.value.trim().toLowerCase();               // o que foi digitado na busca
  const campo = sortSelect.value === "author" ? "autor" : "titulo";   // ordenar por autor ou título

  // 1) FILTRAR: só os livros da categoria escolhida E que combinam com a busca
  const resultado = livros.filter(livro => {
    const naCategoria = categoriaAtiva === "Todas" || livro.categoria === categoriaAtiva;
    const naBusca = `${livro.titulo} ${livro.autor} ${livro.categoria}`.toLowerCase().includes(busca);
    return naCategoria && naBusca;
  });

  // 2) ORDENAR: de A a Z (localeCompare respeita os acentos)
  resultado.sort((a, b) => a[campo].localeCompare(b[campo], "pt-BR"));

  // 3) DESENHAR: apaga a estante e coloca os livros, com uma prateleira a cada 5
  bookshelf.replaceChildren();
  resultado.forEach((livro, indice) => {
    bookshelf.append(criarLivro(livro));
    if ((indice + 1) % 5 === 0 && indice !== resultado.length - 1) {
      const prateleira = document.createElement("div");
      prateleira.className = "shelf-board";
      bookshelf.append(prateleira);
    }
  });

  // 4) TEXTOS em volta da estante
  emptyState.hidden = resultado.length > 0;
  resultsCount.textContent = `${resultado.length} ${resultado.length === 1 ? "livro encontrado" : "livros encontrados"}`;
  collectionTitle.textContent = `Estante: ${categoriaAtiva === "Todas" ? "Todos os livros" : categoriaAtiva}`;
}


// =====================================================================
// 5) JANELA DE DETALHES
// =====================================================================

// abrirDetalhes: preenche a janela com o livro clicado e abre
function abrirDetalhes(livro) {
  livroSelecionado = livro;   // guarda qual livro está aberto (excluir e favoritar usam isso)

  dialogTitle.textContent = livro.titulo;
  dialogAuthor.textContent = livro.autor;
  dialogCategory.textContent = livro.categoria;
  dialogSynopsis.textContent = livro.sinopse;

  // capa: um retângulo com a cor do livro
  dialogCover.alt = `Capa demonstrativa de ${livro.titulo}`;
  dialogCover.style.background = livro.cor;
  dialogCover.style.borderColor = livro.cor;

  // "Ler agora": só aparece se o livro tiver link de PDF
  readLink.href = livro.pdf;
  readLink.style.display = livro.pdf ? "" : "none";
  dialogHelp.textContent = livro.pdf ? "O PDF será aberto em uma nova aba." : "Este livro não tem PDF cadastrado.";

  atualizarBotaoFavorito();
  dialog.showModal();   // abre a janela
}

// atualizarBotaoFavorito: muda o texto do botão de favorito
function atualizarBotaoFavorito() {
  favoriteButton.textContent = livroSelecionado.favorito ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos";
}


// =====================================================================
// 6) CATEGORIAS, BUSCA E ORDENAÇÃO
// =====================================================================

// Clique em uma categoria
categoryGrid.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");   // qual botão foi clicado?
  if (!botao) return;                                       // clicou fora de um botão: ignora

  categoriaAtiva = botao.dataset.category;                  // lê o data-category do HTML
  categoryGrid.querySelectorAll("[data-category]").forEach(item => {
    item.classList.toggle("selected", item === botao);      // só o botão clicado fica destacado
  });
  renderizarAcervo();
  document.querySelector("#acervo").scrollIntoView({ behavior: "smooth" });   // rola até a estante
});

// Digitar na busca: filtra a cada letra
searchInput.addEventListener("input", renderizarAcervo);

// Apertar Enter na busca: não recarrega a página
searchForm.addEventListener("submit", evento => evento.preventDefault());

// Mudar a ordenação
sortSelect.addEventListener("change", renderizarAcervo);


// =====================================================================
// 7) ADICIONAR LIVRO
// =====================================================================

// "+ Adicionar livro" abre o formulário limpo
addButton.addEventListener("click", () => {
  addForm.reset();
  addMessage.textContent = "";
  addDialog.showModal();
});

// "Cancelar" fecha o formulário
cancelAdd.addEventListener("click", () => addDialog.close());

// Enviar o formulário
addForm.addEventListener("submit", async evento => {
  evento.preventDefault();   // não recarrega a página

  // 1) Pega o que foi digitado (pelo "name" de cada campo no HTML)
  const campos = addForm.elements;
  const novo = {
    id: Date.now(),                                   // número único (milissegundos desde 1970)
    titulo: campos.titulo.value.trim(),
    autor: campos.autor.value.trim(),
    categoria: campos.categoria.value,
    sinopse: campos.sinopse.value.trim(),
    pdf: campos.pdf.value.trim(),                     // opcional
    cor: cores[livros.length % cores.length],         // escolhe uma cor da lista, em rodízio
    favorito: false
  };

  // 2) Confere se está tudo preenchido
  if (!novo.titulo || !novo.autor || !novo.categoria || !novo.sinopse) {
    addMessage.textContent = "Preencha título, autor, categoria e sinopse.";
    return;
  }

  // 3) Confere se o livro já existe (mesmo título e autor)
  const jaExiste = livros.some(livro =>
    livro.titulo.toLowerCase() === novo.titulo.toLowerCase() &&
    livro.autor.toLowerCase() === novo.autor.toLowerCase());
  if (jaExiste) {
    addMessage.textContent = "Esse livro já está na estante.";
    return;
  }

  // 4) Coloca na lista, GRAVA no livros.json e redesenha
  livros.push(novo);
  await salvarLivros();
  addDialog.close();
  renderizarAcervo();
  addStatus.textContent = `"${novo.titulo}" foi adicionado à estante.`;
});


// =====================================================================
// 8) EXCLUIR LIVRO
// =====================================================================
deleteButton.addEventListener("click", async () => {
  if (!confirm(`Excluir "${livroSelecionado.titulo}" da estante?`)) return;   // se cancelar, para aqui

  livros = livros.filter(livro => livro.id !== livroSelecionado.id);          // lista nova SEM esse livro
  await salvarLivros();                                                       // grava no livros.json
  dialog.close();
  renderizarAcervo();
  addStatus.textContent = `"${livroSelecionado.titulo}" foi excluído.`;
});


// =====================================================================
// 9) FAVORITAR
// =====================================================================
favoriteButton.addEventListener("click", async () => {
  livroSelecionado.favorito = !livroSelecionado.favorito;   // ! inverte: true vira false, false vira true
  await salvarLivros();                                     // grava no livros.json
  atualizarBotaoFavorito();
});


// =====================================================================
// 10) COMEÇAR: busca os livros no servidor e desenha a estante
// =====================================================================
carregarLivros().catch(() => {
  resultsCount.textContent = "Servidor desligado. No terminal, rode: node server.js";
});
