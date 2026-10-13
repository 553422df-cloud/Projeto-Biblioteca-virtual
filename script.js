/*
  CATÁLOGO DA BIBLIOTECA
  1. Troque os exemplos abaixo pelos dados reais.
  2. No campo pdfId, informe o ID do arquivo no Google Drive.
  3. Para imagens de capa, use um caminho local (ex.: "capas/livro.jpg")
     ou uma URL de imagem que você tenha direito de utilizar.
*/
const livros = [
  {
    id: 1,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Infantil e juvenil",
    sinopse: "Um pequeno príncipe viaja por diferentes planetas e encontra personagens que o ajudam a refletir sobre amizade, afeto, responsabilidade e o sentido da vida.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#234b70"
  },
  {
    id: 2,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    categoria: "Ficção",
    sinopse: "Narrado por Bento Santiago, o romance revisita sua história com Capitu e convida o leitor a questionar memória, ciúme e os limites entre fatos e interpretação.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#6e3928"
  },
  {
    id: 3,
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Ficção",
    sinopse: "Em uma sociedade submetida à vigilância e ao controle da informação, Winston Smith começa a questionar o regime que governa todos os aspectos da vida.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#283b36"
  },
  {
    id: 4,
    titulo: "Sapiens",
    autor: "Yuval Noah Harari",
    categoria: "Não ficção",
    sinopse: "Uma visão panorâmica da história humana, explorando transformações culturais, sociais e tecnológicas que moldaram as sociedades.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#9b7845"
  },
  {
    id: 5,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    categoria: "Ficção",
    sinopse: "Um jovem pastor parte em uma jornada em busca de um tesouro e encontra experiências que transformam sua maneira de compreender o mundo.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#81502b"
  },
  {
    id: 6,
    titulo: "Uma Breve História do Tempo",
    autor: "Stephen Hawking",
    categoria: "Ciência e tecnologia",
    sinopse: "Uma introdução a perguntas fundamentais sobre o universo, o espaço, o tempo, os buracos negros e as leis que regem a natureza.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#254c62"
  },
  {
    id: 7,
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    sinopse: "Uma abordagem prática sobre como pequenas mudanças repetidas podem ajudar a construir hábitos e a criar sistemas para alcançar objetivos.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#59633c"
  }
];

const bookshelf = document.querySelector("#bookshelf");
const categoryGrid = document.querySelector("#category-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const collectionTitle = document.querySelector("#collection-title");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const dialog = document.querySelector("#book-dialog");
const dialogCover = document.querySelector("#dialog-cover");
const dialogTitle = document.querySelector("#dialog-title");
const dialogAuthor = document.querySelector("#dialog-author");
const dialogCategory = document.querySelector("#dialog-category");
const dialogSynopsis = document.querySelector("#dialog-synopsis");
const readLink = document.querySelector("#read-link");
const favoriteButton = document.querySelector("#favorite-button");
const dialogHelp = document.querySelector("#dialog-help");

let categoriaAtiva = "Todas";
let termoBusca = "";
let livroSelecionado = null;
const favoritos = new Set();

function escaparHTML(valor = "") {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[caractere]);
}

function urlPDF(livro) {
  const id = livro.pdfId?.trim();
  if (!id || id === "COLOQUE_O_ID_DO_PDF_AQUI") return "";
  return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
}

function urlCapa(livro) {
  if (livro.capa) return livro.capa;
  // Capa demonstrativa criada em CSS. Para uma imagem real, preencha o campo "capa".
  return "";
}

function livrosVisiveis() {
  const termo = termoBusca.toLocaleLowerCase("pt-BR");
  return livros.filter(livro => {
    const correspondeCategoria = categoriaAtiva === "Todas" || livro.categoria === categoriaAtiva;
    const texto = `${livro.titulo} ${livro.autor} ${livro.categoria} ${livro.sinopse}`.toLocaleLowerCase("pt-BR");
    return correspondeCategoria && texto.includes(termo);
  }).sort((a, b) => {
    const campo = sortSelect.value === "author" ? "autor" : "titulo";
    return a[campo].localeCompare(b[campo], "pt-BR");
  });
}

function criarLivro(livro) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.className = "book";
  botao.setAttribute("aria-label", `Ver detalhes de ${livro.titulo}, por ${livro.autor}`);

  const capa = urlCapa(livro);
  const conteudoCapa = capa
    ? `<img src="${escaparHTML(capa)}" alt="" style="width:100%;height:100%;object-fit:cover">`
    : `<span class="cover-ornament" aria-hidden="true">✦</span>
       <span class="cover-title">${escaparHTML(livro.titulo)}</span>
       <span class="cover-author">${escaparHTML(livro.autor)}</span>`;

  botao.innerHTML = `
    <span class="book-cover" style="background:${escaparHTML(livro.cor || "#28443d")}">${conteudoCapa}</span>
    <span class="book-caption">
      <strong>${escaparHTML(livro.titulo)}</strong>
      <span>${escaparHTML(livro.autor)}</span>
    </span>`;
  botao.addEventListener("click", () => abrirDetalhes(livro));
  return botao;
}

function renderizarAcervo() {
  const resultado = livrosVisiveis();
  bookshelf.replaceChildren();

  resultado.forEach((livro, indice) => {
    bookshelf.appendChild(criarLivro(livro));
    if ((indice + 1) % 5 === 0 && indice !== resultado.length - 1) {
      const prateleira = document.createElement("div");
      prateleira.className = "shelf-board";
      prateleira.setAttribute("aria-hidden", "true");
      bookshelf.appendChild(prateleira);
    }
  });

  emptyState.hidden = resultado.length > 0;
  resultsCount.textContent = `${resultado.length} ${resultado.length === 1 ? "livro encontrado" : "livros encontrados"}`;
  collectionTitle.textContent = `Estante: ${categoriaAtiva}`;
}

function abrirDetalhes(livro) {
  livroSelecionado = livro;
  dialogTitle.textContent = livro.titulo;
  dialogAuthor.textContent = livro.autor;
  dialogCategory.textContent = livro.categoria;
  dialogSynopsis.textContent = livro.sinopse;

  const capa = urlCapa(livro);
  if (capa) {
    dialogCover.src = capa;
    dialogCover.alt = `Capa de ${livro.titulo}`;
    dialogCover.style.display = "block";
  } else {
    // Usa uma capa tipográfica de demonstração caso ainda não haja imagem.
    dialogCover.removeAttribute("src");
    dialogCover.alt = `Capa demonstrativa de ${livro.titulo}`;
    dialogCover.style.display = "block";
    dialogCover.style.background = livro.cor || "#28443d";
    dialogCover.style.objectFit = "contain";
    dialogCover.style.padding = "14px";
    dialogCover.style.color = "white";
    dialogCover.style.minHeight = "190px";
    dialogCover.style.border = "12px solid " + (livro.cor || "#28443d");
  }

  const pdf = urlPDF(livro);
  readLink.href = pdf || "#";
  readLink.setAttribute("aria-disabled", String(!pdf));
  readLink.style.opacity = pdf ? "1" : ".55";
  dialogHelp.textContent = pdf
    ? "O PDF será aberto em uma nova aba. O acesso depende das permissões do Google Drive."
    : "Adicione o ID real do PDF no script.js para ativar a leitura deste livro.";

  atualizarBotaoFavorito();
  dialog.showModal();
}

function atualizarBotaoFavorito() {
  if (!livroSelecionado) return;
  const favorito = favoritos.has(livroSelecionado.id);
  favoriteButton.textContent = favorito ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos";
  favoriteButton.setAttribute("aria-pressed", String(favorito));
}

categoryGrid.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");
  if (!botao) return;
  categoriaAtiva = botao.dataset.category;
  categoryGrid.querySelectorAll("[data-category]").forEach(item => {
    item.classList.toggle("selected", item === botao);
    item.setAttribute("aria-pressed", String(item === botao));
  });
  renderizarAcervo();
  document.querySelector("#acervo").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchForm.addEventListener("submit", evento => {
  evento.preventDefault();
  termoBusca = searchInput.value.trim();
  renderizarAcervo();
  document.querySelector("#acervo").scrollIntoView({ behavior: "smooth", block: "start" });
});

searchInput.addEventListener("input", () => {
  termoBusca = searchInput.value.trim();
  renderizarAcervo();
});

sortSelect.addEventListener("change", renderizarAcervo);

favoriteButton.addEventListener("click", () => {
  if (!livroSelecionado) return;
  if (favoritos.has(livroSelecionado.id)) favoritos.delete(livroSelecionado.id);
  else favoritos.add(livroSelecionado.id);
  atualizarBotaoFavorito();
});

readLink.addEventListener("click", evento => {
  if (!urlPDF(livroSelecionado || {})) evento.preventDefault();
});

dialog.addEventListener("click", evento => {
  // Fecha ao clicar no fundo escurecido, fora da caixa de diálogo.
  if (evento.target === dialog) dialog.close();
});

renderizarAcervo();
