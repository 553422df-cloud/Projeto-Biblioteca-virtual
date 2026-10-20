
/* ============================================================
   MINHA BIBLIOTECA — script.js
   Busca com sugestões, categorias, cadastro, exclusão e favoritos.
   Os livros são lidos e gravados pelo servidor em livros.json.
   ============================================================ */


/* ============================================================
   1. DADOS
   ============================================================ */

let livros = [];
let categoriaAtiva = "Todas";
let livroSelecionado = null;
let sugestoesVisiveis = false;

const cores = [
  "#234b70",
  "#6e3928",
  "#283b36",
  "#9b7845",
  "#81502b",
  "#254c62",
  "#59633c"
];


/* ============================================================
   2. ELEMENTOS DO HTML
   ============================================================ */

// Estante e controles
const bookshelf = document.querySelector("#bookshelf");
const categoryGrid = document.querySelector("#category-grid");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const sortSelect = document.querySelector("#sort-select");
const collectionTitle = document.querySelector("#collection-title");
const resultsCount = document.querySelector("#results-count");
const emptyState = document.querySelector("#empty-state");
const addStatus = document.querySelector("#add-status");

// Janela de detalhes
const dialog = document.querySelector("#book-dialog");
const dialogCover = document.querySelector("#dialog-cover");
const dialogTitle = document.querySelector("#dialog-title");
const dialogAuthor = document.querySelector("#dialog-author");
const dialogCategory = document.querySelector("#dialog-category");
const dialogSynopsis = document.querySelector("#dialog-synopsis");
const dialogHelp = document.querySelector("#dialog-help");
const readLink = document.querySelector("#read-link");
const favoriteButton = document.querySelector("#favorite-button");
const deleteButton = document.querySelector("#delete-button");

// Formulário de cadastro
const addButton = document.querySelector("#add-book-button");
const addDialog = document.querySelector("#add-dialog");
const addForm = document.querySelector("#add-form");
const addMessage = document.querySelector("#add-message");
const cancelAdd = document.querySelector("#cancel-add");


/* ============================================================
   3. FUNÇÕES AUXILIARES
   ============================================================ */

// Deixa a busca sem acentos e em letras minúsculas.
// Exemplo: "Hábitos" vira "habitos".
function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}


// Cria um elemento HTML usando texto seguro.
function criarTexto(tag, classe, texto) {
  const elemento = document.createElement(tag);

  elemento.className = classe;
  elemento.textContent = texto ?? "";

  return elemento;
}


// Compara textos em português, ignorando diferenças de acentos
// para que a ordenação seja mais natural.
function compararTextos(a, b) {
  return String(a ?? "").localeCompare(
    String(b ?? ""),
    "pt-BR",
    { sensitivity: "base" }
  );
}


// Retorna um texto com os campos que podem ser pesquisados.
function textoPesquisavel(livro) {
  return [
    livro.titulo,
    livro.autor,
    livro.categoria,
    livro.sinopse
  ].join(" ");
}


/* ============================================================
   4. CARREGAR E SALVAR OS LIVROS (sem servidor)
   ============================================================ */

// Carrega os livros: primeiro procura no navegador; se não tiver, lê o livros.json.
async function carregarLivros() {
  const salvos = localStorage.getItem("livros");   // este navegador já tem uma lista salva?
  let dados;

  if (salvos) {
    dados = JSON.parse(salvos);                     // SIM: usa a lista salva (texto -> lista)
  } else {
    const resposta = await fetch("livros.json");    // NÃO: lê o arquivo livros.json (lista inicial)

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar os livros.");
    }

    dados = await resposta.json();
  }

  if (!Array.isArray(dados)) {
    throw new Error("A lista de livros recebida é inválida.");
  }

  // Prepara os campos opcionais para evitar erros.
  livros = dados.map((livro, indice) => ({
    ...livro,
    id: livro.id ?? `livro-${indice}`,
    titulo: livro.titulo ?? "",
    autor: livro.autor ?? "",
    categoria: livro.categoria ?? "",
    sinopse: livro.sinopse ?? "",
    pdf: livro.pdf ?? "",
    cor: livro.cor || cores[indice % cores.length],
    favorito: Boolean(livro.favorito)
  }));

  renderizarAcervo();
}


// Grava a lista atual no navegador de quem está usando o site.
async function salvarLivros() {
  localStorage.setItem("livros", JSON.stringify(livros));   // lista -> texto, e guarda
}


/* ============================================================
   5. CRIAR OS LIVROS NA ESTANTE
   ============================================================ */

function criarLivro(livro) {
  const capa = document.createElement("span");

  capa.className = "book-cover";
  capa.style.background = livro.cor;

  if (livro.capa) {
    // O livro TEM imagem de capa: mostra a imagem
    const imagem = document.createElement("img");
    imagem.className = "cover-image";
    imagem.src = livro.capa;      // o caminho que está no livros.json (ex.: "img/dom-casmurro.jpg")
    imagem.alt = "";
    capa.append(imagem);
  } else {
    // O livro NÃO tem imagem: capa colorida com estrelinha, título e autor (como antes)
    capa.innerHTML = `<span class="cover-ornament">✦</span>`;
    capa.append(criarTexto("span", "cover-title", livro.titulo), criarTexto("span", "cover-author", livro.autor));
  }

  const legenda = document.createElement("span");
  legenda.className = "book-caption";

  legenda.append(
    criarTexto("strong", "", livro.titulo),
    criarTexto("span", "", livro.autor)
  );

  const botao = document.createElement("button");

  botao.className = "book";
  botao.type = "button";
  botao.setAttribute(
    "aria-label",
    `Ver detalhes de ${livro.titulo}`
  );

  botao.append(capa, legenda);

  botao.addEventListener("click", () => {
    abrirDetalhes(livro);
  });

  return botao;
}


/* ============================================================
   6. FILTRAR, ORDENAR E DESENHAR A ESTANTE
   ============================================================ */

function renderizarAcervo() {
  const busca = normalizarTexto(searchInput.value);

  const campo =
    sortSelect.value === "author" ? "autor" : "titulo";

  // Primeiro filtra pela categoria e pelo texto digitado.
  const resultado = livros.filter(livro => {
    const naCategoria =
      categoriaAtiva === "Todas" ||
      normalizarTexto(livro.categoria) ===
      normalizarTexto(categoriaAtiva);

    const naBusca = normalizarTexto(
      textoPesquisavel(livro)
    ).includes(busca);

    return naCategoria && naBusca;
  });

  // Depois ordena os resultados.
  resultado.sort((a, b) => {
    return compararTextos(a[campo], b[campo]);
  });

  // Limpa a estante antes de desenhá-la novamente.
  bookshelf.replaceChildren();

  resultado.forEach((livro, indice) => {
    bookshelf.append(criarLivro(livro));

    // Acrescenta uma prateleira a cada cinco livros.
    if (
      (indice + 1) % 5 === 0 &&
      indice !== resultado.length - 1
    ) {
      const prateleira = document.createElement("div");

      prateleira.className = "shelf-board";
      bookshelf.append(prateleira);
    }
  });

  // Atualiza as mensagens da página.
  emptyState.hidden = resultado.length > 0;

  resultsCount.textContent =
    `${resultado.length} ${resultado.length === 1
      ? "livro encontrado"
      : "livros encontrados"
    }`;

  collectionTitle.textContent =
    `Estante: ${categoriaAtiva === "Todas"
      ? "Todos os livros"
      : categoriaAtiva
    }`;
}


/* ============================================================
   7. SUGESTÕES DA BUSCA
   ============================================================ */

// Cria a caixa de sugestões sem precisar alterar o HTML.
const searchSuggestions = document.createElement("div");

searchSuggestions.id = "search-suggestions";
searchSuggestions.setAttribute("role", "listbox");
searchSuggestions.setAttribute(
  "aria-label",
  "Sugestões de livros"
);

Object.assign(searchSuggestions.style, {
  position: "fixed",
  display: "none",
  overflowY: "auto",
  maxHeight: "min(60vh, 420px)",
  background: "#1a201e",
  color: "#f8f2e9",
  border: "1px solid #87552f",
  borderRadius: "12px",
  boxShadow: "0 12px 30px #0008",
  zIndex: "9999",
  padding: "6px",
  boxSizing: "border-box"
});

document.body.append(searchSuggestions);


// Ajusta a caixa para ficar logo abaixo do campo de busca.
function posicionarSugestoes() {
  if (!sugestoesVisiveis) return;

  const retangulo = searchInput.getBoundingClientRect();

  searchSuggestions.style.left = `${retangulo.left}px`;
  searchSuggestions.style.top = `${retangulo.bottom + 6}px`;
  searchSuggestions.style.width = `${retangulo.width}px`;
}


// Exibe uma mensagem dentro da lista de sugestões.
function mostrarMensagemSugestoes(mensagem) {
  searchSuggestions.replaceChildren();

  const texto = criarTexto("div", "", mensagem);

  Object.assign(texto.style, {
    padding: "14px",
    color: "#c9c0b4",
    fontSize: "14px"
  });

  searchSuggestions.append(texto);
}


// Monta a lista de sugestões.
function mostrarSugestoes() {
  const termo = normalizarTexto(searchInput.value);

  // A lista de sugestões considera todos os livros,
  // independentemente da categoria selecionada.
  const encontrados = livros
    .filter(livro => {
      return normalizarTexto(
        textoPesquisavel(livro)
      ).includes(termo);
    })
    .sort((a, b) => compararTextos(a.titulo, b.titulo));

  searchSuggestions.replaceChildren();

  if (encontrados.length === 0) {
    mostrarMensagemSugestoes(
      "Nenhum livro correspondente."
    );
  } else {
    encontrados.forEach(livro => {
      const opcao = document.createElement("button");

      opcao.type = "button";
      opcao.setAttribute("role", "option");

      Object.assign(opcao.style, {
        display: "block",
        width: "100%",
        padding: "11px 12px",
        border: "0",
        borderRadius: "7px",
        background: "transparent",
        color: "#f8f2e9",
        textAlign: "left",
        cursor: "pointer"
      });

      const titulo = criarTexto(
        "span",
        "",
        livro.titulo
      );

      titulo.style.display = "block";
      titulo.style.fontWeight = "700";

      const autor = criarTexto(
        "span",
        "",
        `${livro.autor} · ${livro.categoria}`
      );

      Object.assign(autor.style, {
        display: "block",
        marginTop: "4px",
        fontSize: "12px",
        color: "#c9c0b4"
      });

      opcao.append(titulo, autor);

      opcao.addEventListener("mouseenter", () => {
        opcao.style.background = "#303a35";
      });

      opcao.addEventListener("mouseleave", () => {
        opcao.style.background = "transparent";
      });

      opcao.addEventListener("click", () => {
        searchInput.value = livro.titulo;

        // Ao escolher uma sugestão, mostra o livro
        // mesmo que outra categoria estivesse selecionada.
        categoriaAtiva = "Todas";

        categoryGrid
          .querySelectorAll("[data-category]")
          .forEach(botao => {
            botao.classList.toggle(
              "selected",
              botao.dataset.category === "Todas"
            );
          });

        esconderSugestoes();
        renderizarAcervo();

        document.querySelector("#acervo").scrollIntoView({
          behavior: "smooth"
        });
      });

      searchSuggestions.append(opcao);
    });
  }

  sugestoesVisiveis = true;
  searchSuggestions.style.display = "block";

  posicionarSugestoes();
}


// Esconde a caixa de sugestões.
function esconderSugestoes() {
  sugestoesVisiveis = false;
  searchSuggestions.style.display = "none";
}


// Ao digitar, atualiza os resultados e as sugestões.
searchInput.addEventListener("input", () => {
  renderizarAcervo();
  mostrarSugestoes();
});


// Ao clicar no campo, mostra todos os livros em ordem alfabética
// quando a pesquisa estiver vazia.
searchInput.addEventListener("focus", mostrarSugestoes);


// Enter não recarrega a página.
searchForm.addEventListener("submit", evento => {
  evento.preventDefault();

  esconderSugestoes();
  renderizarAcervo();

  document.querySelector("#acervo").scrollIntoView({
    behavior: "smooth"
  });
});


// Fecha a lista ao clicar fora dela.
document.addEventListener("click", evento => {
  if (
    !searchInput.contains(evento.target) &&
    !searchSuggestions.contains(evento.target)
  ) {
    esconderSugestoes();
  }
});


// Fecha as sugestões com Escape.
searchInput.addEventListener("keydown", evento => {
  if (evento.key === "Escape") {
    esconderSugestoes();
  }
});


// Mantém a caixa alinhada durante a rolagem ou redimensionamento.
window.addEventListener("resize", posicionarSugestoes);
window.addEventListener("scroll", posicionarSugestoes, true);


// Muda a ordenação da estante.
sortSelect.addEventListener("change", renderizarAcervo);


/* ============================================================
   8. CATEGORIAS
   ============================================================ */

categoryGrid.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");

  if (!botao) return;

  categoriaAtiva = botao.dataset.category;

  categoryGrid
    .querySelectorAll("[data-category]")
    .forEach(item => {
      item.classList.toggle("selected", item === botao);
    });

  renderizarAcervo();

  document.querySelector("#acervo").scrollIntoView({
    behavior: "smooth"
  });
});


/* ============================================================
   9. JANELA DE DETALHES
   ============================================================ */

function abrirDetalhes(livro) {
  livroSelecionado = livro;

  dialogTitle.textContent = livro.titulo;
  dialogAuthor.textContent = livro.autor;
  dialogCategory.textContent = livro.categoria;
  dialogSynopsis.textContent =
    livro.sinopse || "Nenhuma sinopse cadastrada.";

  dialogCover.alt = `Capa demonstrativa de ${livro.titulo}`;
  dialogCover.removeAttribute("src");
  dialogCover.style.background = livro.cor;
  dialogCover.style.borderColor = livro.cor;
  if (livro.capa) {
    dialogCover.src = livro.capa;          // tem imagem: mostra a imagem na janela
  } else {
    dialogCover.removeAttribute("src");    // não tem: tira a imagem do livro anterior (fica só a cor)
  }

  // Só mostra o botão de leitura se existir um PDF cadastrado.
  const temPdf = Boolean(livro.pdf);

  readLink.href = temPdf ? livro.pdf : "#";
  readLink.style.display = temPdf ? "" : "none";

  dialogHelp.textContent = temPdf
    ? "O PDF será aberto em uma nova aba."
    : "Este livro não tem PDF cadastrado.";

  atualizarBotaoFavorito();

  dialog.showModal();
}


function atualizarBotaoFavorito() {
  if (!livroSelecionado) return;

  favoriteButton.textContent = livroSelecionado.favorito
    ? "♥ Remover dos favoritos"
    : "♡ Adicionar aos favoritos";
}


/* ============================================================
   10. ADICIONAR LIVRO
   ============================================================ */

addButton.addEventListener("click", () => {
  addForm.reset();
  addMessage.textContent = "";
  addDialog.showModal();
});


cancelAdd.addEventListener("click", () => {
  addDialog.close();
});


addForm.addEventListener("submit", async evento => {
  evento.preventDefault();

  const campos = addForm.elements;

  const novo = {
    id: Date.now(),
    titulo: campos.titulo.value.trim(),
    autor: campos.autor.value.trim(),
    categoria: campos.categoria.value,
    sinopse: campos.sinopse.value.trim(),
    pdf: campos.pdf.value.trim(),
    cor: cores[livros.length % cores.length],
    favorito: false
  };

  if (
    !novo.titulo ||
    !novo.autor ||
    !novo.categoria ||
    !novo.sinopse
  ) {
    addMessage.textContent =
      "Preencha título, autor, categoria e sinopse.";
    return;
  }

  if (
    novo.pdf &&
    !/^https?:\/\//i.test(novo.pdf)
  ) {
    addMessage.textContent =
      "O link do PDF deve começar com http:// ou https://.";
    return;
  }

  const jaExiste = livros.some(livro =>
    normalizarTexto(livro.titulo) ===
    normalizarTexto(novo.titulo) &&
    normalizarTexto(livro.autor) ===
    normalizarTexto(novo.autor)
  );

  if (jaExiste) {
    addMessage.textContent =
      "Esse livro já está na estante.";
    return;
  }

  livros.push(novo);

  try {
    await salvarLivros();

    addDialog.close();
    renderizarAcervo();

    addStatus.textContent =
      `"${novo.titulo}" foi adicionado à estante.`;

    // Atualiza as sugestões se a caixa de busca estiver aberta.
    if (sugestoesVisiveis) {
      mostrarSugestoes();
    }
  } catch (erro) {
    // Desfaz a inclusão local se o servidor não salvar.
    livros = livros.filter(livro => livro.id !== novo.id);

    addMessage.textContent =
      "Não foi possível salvar o livro. Verifique se o servidor está ligado.";

    console.error(erro);
  }
});


/* ============================================================
   11. EXCLUIR LIVRO
   ============================================================ */

deleteButton.addEventListener("click", async () => {
  if (!livroSelecionado) return;

  const livroExcluido = livroSelecionado;

  const confirmou = confirm(
    `Excluir "${livroExcluido.titulo}" da estante?`
  );

  if (!confirmou) return;

  const listaAnterior = [...livros];

  livros = livros.filter(
    livro => livro.id !== livroExcluido.id
  );

  try {
    await salvarLivros();

    dialog.close();
    livroSelecionado = null;

    renderizarAcervo();

    addStatus.textContent =
      `"${livroExcluido.titulo}" foi excluído.`;

    if (sugestoesVisiveis) {
      mostrarSugestoes();
    }
  } catch (erro) {
    livros = listaAnterior;

    renderizarAcervo();

    alert(
      "Não foi possível excluir o livro. Verifique o servidor."
    );

    console.error(erro);
  }
});


/* ============================================================
   12. FAVORITAR LIVRO
   ============================================================ */

favoriteButton.addEventListener("click", async () => {
  if (!livroSelecionado) return;

  const favoritoAnterior = livroSelecionado.favorito;

  livroSelecionado.favorito = !favoritoAnterior;

  atualizarBotaoFavorito();

  try {
    await salvarLivros();
  } catch (erro) {
    // Reverte o botão se não foi possível gravar a mudança.
    livroSelecionado.favorito = favoritoAnterior;

    atualizarBotaoFavorito();

    alert(
      "Não foi possível salvar o favorito. Verifique o servidor."
    );

    console.error(erro);
  }
});


/* ============================================================
   13. INICIALIZAÇÃO
   ============================================================ */

carregarLivros().catch(erro => {
  resultsCount.textContent =
    "Servidor desligado. No terminal, rode: node server.js";

  emptyState.hidden = false;

  console.error(
    "Erro ao carregar os livros:",
    erro
  );
});
