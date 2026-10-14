
/* =========================================
   MINHA BIBLIOTECA — SCRIPT COMPLETO
========================================= */

const livros = [
  {
    id: 1,
    titulo: "O Pequeno Príncipe",
    autor: "Antoine de Saint-Exupéry",
    categoria: "Infantil e juvenil",
    sinopse: "Um pequeno príncipe viaja por diferentes planetas e reflete sobre amizade, afeto e responsabilidade.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#234b70"
  },
  {
    id: 2,
    titulo: "Dom Casmurro",
    autor: "Machado de Assis",
    categoria: "Ficção",
    sinopse: "Bento Santiago revisita sua história com Capitu e questiona memória, ciúme e interpretação.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#6e3928"
  },
  {
    id: 3,
    titulo: "1984",
    autor: "George Orwell",
    categoria: "Ficção",
    sinopse: "Winston Smith começa a questionar uma sociedade submetida à vigilância e ao controle.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#283b36"
  },
  {
    id: 4,
    titulo: "Sapiens",
    autor: "Yuval Noah Harari",
    categoria: "Não ficção",
    sinopse: "Uma visão da história humana e das transformações que moldaram as sociedades.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#9b7845"
  },
  {
    id: 5,
    titulo: "O Alquimista",
    autor: "Paulo Coelho",
    categoria: "Ficção",
    sinopse: "Um jovem pastor parte em busca de um tesouro e transforma sua maneira de compreender o mundo.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#81502b"
  },
  {
    id: 6,
    titulo: "Uma Breve História do Tempo",
    autor: "Stephen Hawking",
    categoria: "Ciência e tecnologia",
    sinopse: "Uma introdução ao universo, ao espaço, ao tempo e aos buracos negros.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#254c62"
  },
  {
    id: 7,
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    sinopse: "Como pequenas mudanças podem ajudar a construir hábitos e alcançar objetivos.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#59633c"
  }
];

/* ELEMENTOS DO HTML */

const bookshelf = document.querySelector("#bookshelf");
const categoryGrid = document.querySelector("#category-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchSuggestions = document.querySelector("#search-suggestions");
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

/* VERIFICA SE OS ELEMENTOS PRINCIPAIS EXISTEM */

if (
  !bookshelf ||
  !categoryGrid ||
  !searchForm ||
  !searchInput ||
  !searchSuggestions ||
  !sortSelect ||
  !collectionTitle ||
  !resultsCount ||
  !emptyState
) {
  console.error(
    "Biblioteca: verifique os IDs do HTML e se o script.js está carregado."
  );
} else {

/* NORMALIZA TEXTO: IGNORA ACENTOS E MAIÚSCULAS */

function normalizarTexto(texto = "") {
  return String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

/* PROTEGE TEXTO INSERIDO NO HTML */

function escaparHTML(valor = "") {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

/* LINKS DOS PDFs E DAS CAPAS */

function urlPDF(livro) {
  const id = String(livro.pdfId || "").trim();

  if (!id || id === "COLOQUE_O_ID_DO_PDF_AQUI") {
    return "";
  }

  return `https://drive.google.com/file/d/${encodeURIComponent(id)}/preview`;
}

function urlCapa(livro) {
  return livro.capa ? livro.capa : "";
}

/* FILTRA OS LIVROS DA ESTANTE */

function livrosVisiveis() {
  const termo = normalizarTexto(termoBusca);

  return livros
    .filter(livro => {
      const correspondeCategoria =
        categoriaAtiva === "Todas" ||
        livro.categoria === categoriaAtiva;

      const textoLivro = normalizarTexto(
        `${livro.titulo} ${livro.autor} ${livro.categoria} ${livro.sinopse}`
      );

      return correspondeCategoria && textoLivro.includes(termo);
    })
    .sort((a, b) => {
      const campo =
        sortSelect.value === "author" ? "autor" : "titulo";

      return a[campo].localeCompare(b[campo], "pt-BR");
    });
}

/* BUSCA INTELIGENTE: MOSTRA SUGESTÕES */


function mostrarSugestoes() {
  const termo = normalizarTexto(searchInput.value);

  searchSuggestions.replaceChildren();

  // Mostra todos os livros quando o campo está vazio.
  const encontrados = livros
    .filter(livro => {
      const textoLivro = normalizarTexto(
        `${livro.titulo} ${livro.autor} ${livro.categoria} ${livro.sinopse}`
      );

      return !termo || textoLivro.includes(termo);
    })
    .sort((a, b) => {
      const tituloA = normalizarTexto(a.titulo);
      const tituloB = normalizarTexto(b.titulo);

      const comecaA = tituloA.startsWith(termo);
      const comecaB = tituloB.startsWith(termo);

      if (termo && comecaA && !comecaB) return -1;
      if (termo && !comecaA && comecaB) return 1;

      return tituloA.localeCompare(tituloB, "pt-BR");
    });

  if (encontrados.length === 0) {
    const aviso = document.createElement("div");
    aviso.className = "suggestion-empty";
    aviso.textContent = "Nenhum livro correspondente.";
    searchSuggestions.appendChild(aviso);
    searchSuggestions.hidden = false;
    return;
  }

  encontrados.forEach(livro => {
    const opcao = document.createElement("button");
    opcao.type = "button";
    opcao.className = "search-suggestion";
    opcao.setAttribute("role", "option");

    const titulo = document.createElement("strong");
    titulo.textContent = livro.titulo;

    const autor = document.createElement("span");
    autor.textContent = livro.autor;

    opcao.append(titulo, autor);

    opcao.addEventListener("click", () => {
      searchInput.value = livro.titulo;
      termoBusca = livro.titulo;
      categoriaAtiva = "Todas";

      categoryGrid.querySelectorAll("[data-category]").forEach(item => {
        const selecionado = item.dataset.category === "Todas";
        item.classList.toggle("selected", selecionado);
        item.setAttribute("aria-pressed", String(selecionado));
      });

      searchSuggestions.hidden = true;
      renderizarAcervo();

      document.querySelector("#acervo")?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });

    searchSuggestions.appendChild(opcao);
  });

  searchSuggestions.hidden = false;
}

/* CRIA CADA LIVRO DA ESTANTE */

function criarLivro(livro) {
  const botao = document.createElement("button");

  botao.type = "button";
  botao.className = "book";
  botao.setAttribute(
    "aria-label",
    `Ver detalhes de ${livro.titulo}, por ${livro.autor}`
  );

  const capa = urlCapa(livro);

  const conteudoCapa = capa
    ? `<img src="${escaparHTML(capa)}" alt="" style="width:100%;height:100%;object-fit:cover">`
    : `
      <span class="cover-ornament" aria-hidden="true">✦</span>
      <span class="cover-title">${escaparHTML(livro.titulo)}</span>
      <span class="cover-author">${escaparHTML(livro.autor)}</span>
    `;

  botao.innerHTML = `
    <span class="book-cover"
      style="background:${escaparHTML(livro.cor || "#28443d")}">
      ${conteudoCapa}
    </span>
    <span class="book-caption">
      <strong>${escaparHTML(livro.titulo)}</strong>
      <span>${escaparHTML(livro.autor)}</span>
    </span>
  `;

  botao.addEventListener("click", () => abrirDetalhes(livro));

  return botao;
}

/* ATUALIZA A ESTANTE */

function renderizarAcervo() {
  const resultado = livrosVisiveis();

  bookshelf.replaceChildren();

  resultado.forEach((livro, indice) => {
    bookshelf.appendChild(criarLivro(livro));

    if (
      (indice + 1) % 5 === 0 &&
      indice !== resultado.length - 1
    ) {
      const prateleira = document.createElement("div");

      prateleira.className = "shelf-board";
      prateleira.setAttribute("aria-hidden", "true");

      bookshelf.appendChild(prateleira);
    }
  });

  emptyState.hidden = resultado.length > 0;

  resultsCount.textContent =
    `${resultado.length} ${
      resultado.length === 1
        ? "livro encontrado"
        : "livros encontrados"
    }`;

  collectionTitle.textContent = `Estante: ${categoriaAtiva}`;
}

/* ABRE OS DETALHES DO LIVRO */

function abrirDetalhes(livro) {
  if (
    !dialog ||
    !dialogCover ||
    !dialogTitle ||
    !dialogAuthor ||
    !dialogCategory ||
    !dialogSynopsis ||
    !readLink ||
    !favoriteButton ||
    !dialogHelp
  ) {
    return;
  }

  livroSelecionado = livro;

  dialogTitle.textContent = livro.titulo;
  dialogAuthor.textContent = livro.autor;
  dialogCategory.textContent = livro.categoria;
  dialogSynopsis.textContent = livro.sinopse;

  const capa = urlCapa(livro);

  if (capa) {
    dialogCover.src = capa;
    dialogCover.alt = `Capa de ${livro.titulo}`;
    dialogCover.style.background = "";
    dialogCover.style.padding = "";
    dialogCover.style.border = "";
    dialogCover.style.objectFit = "cover";
  } else {
    dialogCover.removeAttribute("src");
    dialogCover.alt = `Capa demonstrativa de ${livro.titulo}`;
    dialogCover.style.background = livro.cor || "#28443d";
    dialogCover.style.padding = "14px";
    dialogCover.style.border = `12px solid ${livro.cor || "#28443d"}`;
    dialogCover.style.objectFit = "contain";
  }

  const pdf = urlPDF(livro);

  readLink.href = pdf || "#";
  readLink.setAttribute("aria-disabled", String(!pdf));
  readLink.style.opacity = pdf ? "1" : ".55";

  dialogHelp.textContent = pdf
    ? "O PDF será aberto em uma nova aba. O acesso depende das permissões do Google Drive."
    : "Adicione o ID real do PDF no script.js para ativar a leitura.";

  atualizarBotaoFavorito();

  if (!dialog.open) {
    dialog.showModal();
  }
}

/* FAVORITOS */

function atualizarBotaoFavorito() {
  if (!livroSelecionado || !favoriteButton) return;

  const favorito = favoritos.has(livroSelecionado.id);

  favoriteButton.textContent = favorito
    ? "♥ Remover dos favoritos"
    : "♡ Adicionar aos favoritos";

  favoriteButton.setAttribute("aria-pressed", String(favorito));
}

/* CLIQUE NAS CATEGORIAS */

categoryGrid.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");

  if (!botao) return;

  categoriaAtiva = botao.dataset.category;

  categoryGrid.querySelectorAll("[data-category]").forEach(item => {
    const selecionado = item === botao;

    item.classList.toggle("selected", selecionado);
    item.setAttribute("aria-pressed", String(selecionado));
  });

  renderizarAcervo();

  document.querySelector("#acervo")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* DIGITAÇÃO: ATUALIZA A LISTA E AS SUGESTÕES */

searchInput.addEventListener("input", () => {
  termoBusca = searchInput.value;
  renderizarAcervo();
  mostrarSugestoes();
});

// Mostra todos os livros ao clicar na busca
searchInput.addEventListener("focus", () => {
  mostrarSugestoes();
});

/* ENVIO DA PESQUISA */

searchForm.addEventListener("submit", evento => {
  evento.preventDefault();

  termoBusca = searchInput.value;
  renderizarAcervo();
  searchSuggestions.hidden = true;

  document.querySelector("#acervo")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

/* TECLA ESCAPE */

searchInput.addEventListener("keydown", evento => {
  if (evento.key === "Escape") {
    searchSuggestions.hidden = true;
  }
});

/* FECHA A LISTA AO CLICAR FORA */

document.addEventListener("click", evento => {
  if (!searchForm.contains(evento.target)) {
    searchSuggestions.hidden = true;
  }
});

/* ORDENAÇÃO */

sortSelect.addEventListener("change", renderizarAcervo);

/* BOTÃO DE FAVORITOS */

favoriteButton?.addEventListener("click", () => {
  if (!livroSelecionado) return;

  if (favoritos.has(livroSelecionado.id)) {
    favoritos.delete(livroSelecionado.id);
  } else {
    favoritos.add(livroSelecionado.id);
  }

  atualizarBotaoFavorito();
});

/* ABRIR PDF */

readLink?.addEventListener("click", evento => {
  if (!urlPDF(livroSelecionado || {})) {
    evento.preventDefault();
  }
});

/* FECHAR DETALHES CLICANDO NO FUNDO */

dialog?.addEventListener("click", evento => {
  if (evento.target === dialog) {
    dialog.close();
  }
});

/* INICIALIZA A BIBLIOTECA */

categoryGrid.querySelectorAll("[data-category]").forEach(item => {
  item.setAttribute(
    "aria-pressed",
    String(item.dataset.category === "Todas")
  );
});

renderizarAcervo();

} // Fim da inicialização