/*
  CATÁLOGO DA BIBLIOTECA
  1. Troque os exemplos abaixo pelos dados reais.
  2. No campo pdfId, informe o ID do arquivo no Google Drive.
  3. Para imagens de capa, use um caminho local (ex.: "capas/livro.jpg")
     ou uma URL de imagem que você tenha direito de utilizar.
*/

/*
  =====================================================================
  COMO ESTE ARQUIVO FUNCIONA (a ideia geral)
  =====================================================================
  Tudo se resume a 3 partes:
    1) DADOS ....... a lista "livros" e o que a página "lembra" (categoria, busca...)
    2) DESENHAR .... renderizarAcervo() apaga a estante e desenha de novo só os livros certos
    3) EVENTOS ..... clicar, digitar, enviar: cada evento só MUDA UM DADO e chama o desenhar de novo

  O arquivo roda UMA vez, de cima para baixo, e termina desenhando a estante (última linha).
  Depois a página espera o usuário clicar ou digitar.

  ORDEM: 1 Dados | 2 Elementos | 3 Estado | 4 Funções de apoio | 5 Desenhar a estante |
         6 Janela de detalhes | 7 Eventos | 8 Adicionar livro | 9 Excluir livro | 10 Primeiro desenho
*/


// =====================================================================
// 1) DADOS: a lista de livros
// =====================================================================
// "let" (e não "const") porque, mais abaixo, essa lista é TROCADA por uma nova
// quando livros são excluídos. Uma "const" não pode ser trocada.
// [ ] é a lista, e cada { } é um livro. Entre um livro e outro vai uma vírgula.
let livros = [
  {
    id: 1,                                    // número ÚNICO do livro (favoritos e exclusão usam o id)
    titulo: "O Pequeno Príncipe",             // aparece na capa, na legenda e na janela de detalhes
    autor: "Antoine de Saint-Exupéry",
    categoria: "Infantil e juvenil",          // tem que ser IGUAL ao data-category de um botão de categoria do HTML
    sinopse: "Um pequeno príncipe viaja por diferentes planetas e encontra personagens que o ajudam a refletir sobre amizade, afeto, responsabilidade e o sentido da vida.",   // resumo (aparece na janela)
    pdfId: "https://drive.google.com/file/d/1vMvRINg5PqZxucy5Tx6WogKEVV5_Gz-S/view?usp=sharing",        // ID do arquivo no Google Drive (esse texto significa "ainda não tem PDF")
    capa: "",                                 // caminho de uma imagem de capa; vazio = usa a capa colorida
    cor: "#234b70"                            // cor da capa colorida
  },
  // Os outros livros seguem exatamente o mesmo modelo do livro 1.
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
  // ATENÇÃO: os livros de id 7, 8, 9 e 10 abaixo são IDÊNTICOS (mesmo título e autor).
  // Se não for de propósito (teste), apague os repetidos. Cada livro precisa de um id diferente.
  {
    id: 7,
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    sinopse: "Uma abordagem prática sobre como pequenas mudanças repetidas podem ajudar a construir hábitos e a criar sistemas para alcançar objetivos.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#59633c"
  },
  {
    id: 8,
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    sinopse: "Uma abordagem prática sobre como pequenas mudanças repetidas podem ajudar a construir hábitos e a criar sistemas para alcançar objetivos.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#59633c"
  },
  {
    id: 9,
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    sinopse: "Uma abordagem prática sobre como pequenas mudanças repetidas podem ajudar a construir hábitos e a criar sistemas para alcançar objetivos.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#59633c"
  },
  {
    id: 10,
    titulo: "Hábitos Atômicos",
    autor: "James Clear",
    categoria: "Desenvolvimento pessoal",
    sinopse: "Uma abordagem prática sobre como pequenas mudanças repetidas podem ajudar a construir hábitos e a criar sistemas para alcançar objetivos.",
    pdfId: "COLOQUE_O_ID_DO_PDF_AQUI",
    capa: "",
    cor: "#59633c"
  }

];

// =====================================================================
// 2) ELEMENTOS DA PÁGINA (pegos pelo id que está no HTML)
// =====================================================================
// document.querySelector("#nome") procura o elemento com id="nome" e guarda numa variável.

// --- a estante e os controles ---
const bookshelf = document.querySelector("#bookshelf");               // a caixa VAZIA onde os livros são desenhados
const categoryGrid = document.querySelector("#category-grid");        // o grupo com os botões de categoria
const searchForm = document.querySelector("#search-form");            // o formulário da barra de busca
const searchInput = document.querySelector("#search-input");          // o campo onde se digita a busca
const sortSelect = document.querySelector("#sort-select");            // o menu "Ordenar por"
const collectionTitle = document.querySelector("#collection-title");  // o título "Estante: ..."
const resultsCount = document.querySelector("#results-count");        // o texto "X livros encontrados"
const emptyState = document.querySelector("#empty-state");            // a mensagem "Nenhum livro encontrado"

// --- a janela de detalhes do livro ---
const dialog = document.querySelector("#book-dialog");                // a janela (<dialog>)
const dialogCover = document.querySelector("#dialog-cover");          // a capa dentro da janela
const dialogTitle = document.querySelector("#dialog-title");
const dialogAuthor = document.querySelector("#dialog-author");
const dialogCategory = document.querySelector("#dialog-category");
const dialogSynopsis = document.querySelector("#dialog-synopsis");
const readLink = document.querySelector("#read-link");                // o botão "Ler agora"
const favoriteButton = document.querySelector("#favorite-button");    // o botão de favorito
const dialogHelp = document.querySelector("#dialog-help");            // o texto de ajuda embaixo dos botões


// =====================================================================
// 3) ESTADO: o que a página "lembra"
// =====================================================================
let categoriaAtiva = "Todas";    // categoria escolhida agora ("Todas" = sem filtro)
let termoBusca = "";             // o texto digitado na busca
let livroSelecionado = null;     // o livro aberto na janela (null = nenhum)
const favoritos = new Set();     // ids dos favoritos, sem repetidos (só na memória: some ao atualizar a página)


// =====================================================================
// 4) FUNÇÕES DE APOIO
// =====================================================================

// Lê e salva listas no navegador. O localStorage guarda só TEXTO:
// JSON.stringify transforma a lista em texto, e JSON.parse volta a ser lista.
const ler = chave => JSON.parse(localStorage.getItem(chave) || "[]");
const salvar = (chave, lista) => localStorage.setItem(chave, JSON.stringify(lista));

// Cria um elemento com classe e texto. O textContent é seguro: nunca trata o texto como HTML.
function criar(tag, classe = "", texto = "") {
  const elemento = document.createElement(tag);
  if (classe) elemento.className = classe;
  elemento.textContent = texto;
  return elemento;
}

// urlPDF: o link do PDF do livro. Aceita o link completo do Drive OU só o ID.
// Devolve "" quando o livro não tem PDF (campo vazio ou ainda com o texto de exemplo).
function urlPDF(livro) {
  const pdf = (livro.pdfId || "").trim();
  if (!pdf || pdf === "COLOQUE_O_ID_DO_PDF_AQUI") return "";
  return pdf.startsWith("http") ? pdf : `https://drive.google.com/file/d/${pdf}/preview`;
}

// livrosVisiveis: os livros que devem aparecer AGORA, na ordem certa.
function livrosVisiveis() {
  const busca = termoBusca.toLowerCase();                                // minúsculas: não importa maiúscula/minúscula
  const campo = sortSelect.value === "author" ? "autor" : "titulo";      // ordenar por autor ou por título

  return livros
    .filter(livro => {                                                   // filter: guarda só os livros que passam nos DOIS testes
      const categoriaCombina = categoriaAtiva === "Todas" || livro.categoria === categoriaAtiva;
      const texto = `${livro.titulo} ${livro.autor} ${livro.categoria} ${livro.sinopse}`.toLowerCase();
      return categoriaCombina && texto.includes(busca);
    })
    .sort((a, b) => a[campo].localeCompare(b[campo], "pt-BR"));          // sort: ordena respeitando os acentos do português
}

// Rola a página até a estante.
function irParaAcervo() {
  document.querySelector("#acervo").scrollIntoView({ behavior: "smooth", block: "start" });
}


// =====================================================================
// 5) DESENHAR A ESTANTE
// =====================================================================

// criarLivro: cria o BOTÃO de um livro (capa + legenda) e devolve ele.
// Quem coloca o botão na tela é a renderizarAcervo.
function criarLivro(livro) {
  // A capa: a imagem (se o livro tiver) ou uma capa colorida com título e autor
  const capa = criar("span", "book-cover");
  capa.style.background = livro.cor || "#28443d";
  if (livro.capa) {
    const imagem = criar("img");
    imagem.src = livro.capa;
    imagem.alt = "";
    imagem.style.cssText = "width:100%;height:100%;object-fit:cover";
    capa.append(imagem);
  } else {
    const ornamento = criar("span", "cover-ornament", "✦");
    ornamento.setAttribute("aria-hidden", "true");
    capa.append(ornamento, criar("span", "cover-title", livro.titulo), criar("span", "cover-author", livro.autor));
  }

  // A legenda: título e autor, embaixo da capa
  const legenda = criar("span", "book-caption");
  legenda.append(criar("strong", "", livro.titulo), criar("span", "", livro.autor));

  // O botão que junta tudo
  const botao = criar("button", "book");
  botao.type = "button";
  botao.setAttribute("aria-label", `Ver detalhes de ${livro.titulo}, por ${livro.autor}`);   // texto lido por leitores de tela
  botao.append(capa, legenda);
  botao.addEventListener("click", () => abrirDetalhes(livro));                                // clicar abre a janela
  return botao;
}

// renderizarAcervo: DESENHA a estante. É a função mais importante do arquivo:
// sempre que algo muda (categoria, busca, ordem, livro novo ou excluído), ela é chamada de novo.
function renderizarAcervo() {
  const resultado = livrosVisiveis();                 // 1) os livros que devem aparecer agora
  bookshelf.replaceChildren();                        // 2) apaga tudo o que estava na estante

  resultado.forEach((livro, indice) => {              // 3) coloca cada livro na estante
    bookshelf.append(criarLivro(livro));
    if ((indice + 1) % 5 === 0 && indice !== resultado.length - 1) {   // a cada 5 livros, uma tábua de prateleira
      const prateleira = criar("div", "shelf-board");
      prateleira.setAttribute("aria-hidden", "true");                  // é só decoração: leitores de tela ignoram
      bookshelf.append(prateleira);
    }
  });

  emptyState.hidden = resultado.length > 0;           // 4) "Nenhum livro encontrado" só quando a lista está vazia
  resultsCount.textContent = `${resultado.length} ${resultado.length === 1 ? "livro encontrado" : "livros encontrados"}`;
  collectionTitle.textContent = `Estante: ${categoriaAtiva}`;
}


// =====================================================================
// 6) JANELA DE DETALHES DO LIVRO
// =====================================================================

// abrirDetalhes: preenche a janela com os dados do livro clicado e abre ela.
function abrirDetalhes(livro) {
  livroSelecionado = livro;                           // guarda qual livro está aberto (favorito, PDF e exclusão usam isso)
  dialogTitle.textContent = livro.titulo;
  dialogAuthor.textContent = livro.autor;
  dialogCategory.textContent = livro.categoria;
  dialogSynopsis.textContent = livro.sinopse;

  // A capa: a imagem, ou (sem imagem) o espaço pintado com a cor do livro
  if (livro.capa) {
    dialogCover.src = livro.capa;
    dialogCover.alt = `Capa de ${livro.titulo}`;
    dialogCover.style.display = "block";
  } else {
    const cor = livro.cor || "#28443d";
    dialogCover.removeAttribute("src");
    dialogCover.alt = `Capa demonstrativa de ${livro.titulo}`;
    dialogCover.style.display = "block";
    dialogCover.style.background = cor;
    dialogCover.style.objectFit = "contain";
    dialogCover.style.padding = "14px";
    dialogCover.style.color = "white";
    dialogCover.style.minHeight = "190px";
    dialogCover.style.border = "12px solid " + cor;
  }

  // O botão "Ler agora": fica apagado quando o livro não tem PDF (o clique é tratado na seção 7)
  const pdf = urlPDF(livro);
  readLink.href = pdf || "#";
  readLink.setAttribute("aria-disabled", String(!pdf));
  readLink.style.opacity = pdf ? "1" : ".55";
  dialogHelp.textContent = pdf
    ? "O PDF será aberto em uma nova aba. O acesso depende das permissões do Google Drive."
    : "Adicione o ID real do PDF no script.js para ativar a leitura deste livro.";

  atualizarBotaoFavorito();
  dialog.showModal();                                 // ABRE a janela (com fundo escuro; Esc fecha sozinho)
}

// atualizarBotaoFavorito: troca o texto do botão entre "♡ Adicionar" e "♥ Remover".
function atualizarBotaoFavorito() {
  const favorito = favoritos.has(livroSelecionado.id);
  favoriteButton.textContent = favorito ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos";
  favoriteButton.setAttribute("aria-pressed", String(favorito));
}


// =====================================================================
// 7) EVENTOS: o que acontece quando o usuário clica ou digita
// =====================================================================

// --- Clique em uma categoria (um só "ouvinte" no grupo inteiro) ---
categoryGrid.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");        // qual botão foi clicado?
  if (!botao) return;                                            // clicou fora dos botões: ignora
  categoriaAtiva = botao.dataset.category;                       // lê o data-category do HTML
  categoryGrid.querySelectorAll("[data-category]").forEach(item => {
    item.classList.toggle("selected", item === botao);           // só o clicado fica destacado
    item.setAttribute("aria-pressed", String(item === botao));
  });
  renderizarAcervo();
  irParaAcervo();
});

// --- Digitar na busca: filtra a cada letra ---
searchInput.addEventListener("input", () => {
  termoBusca = searchInput.value.trim();
  renderizarAcervo();
});

// --- Enter na busca: não recarrega a página, só leva até a estante ---
searchForm.addEventListener("submit", evento => {
  evento.preventDefault();
  irParaAcervo();
});

// --- Mudar o menu "Ordenar por" (livrosVisiveis já lê o menu sozinha) ---
sortSelect.addEventListener("change", renderizarAcervo);

// --- Botão de favorito ---
favoriteButton.addEventListener("click", () => {
  if (favoritos.has(livroSelecionado.id)) favoritos.delete(livroSelecionado.id);
  else favoritos.add(livroSelecionado.id);
  atualizarBotaoFavorito();
});

// --- Botão "Ler agora": abre o PDF em outra aba, ou avisa que o livro não tem PDF ---
readLink.addEventListener("click", evento => {
  evento.preventDefault();                                       // nós mesmos abrimos o PDF
  const pdf = urlPDF(livroSelecionado);
  if (!pdf) {
    alert("Este livro ainda não possui um link de PDF.");
    return;
  }
  window.open(pdf, "_blank");
});

// --- Clicar no fundo escuro da janela fecha ela ---
dialog.addEventListener("click", evento => {
  if (evento.target === dialog) dialog.close();                  // só é verdade quando o clique foi no fundo, não no conteúdo
});


// =====================================================================
// 8) ADICIONAR LIVRO PELO SITE
// =====================================================================
const addButton = document.querySelector("#add-book-button");   // o botão "+ Adicionar livro"
const addDialog = document.querySelector("#add-dialog");        // a janela do formulário
const addForm = document.querySelector("#add-form");            // o formulário
const addMessage = document.querySelector("#add-message");      // o aviso de erro dentro da janela
const addStatus = document.querySelector("#add-status");        // o aviso de sucesso (e de exclusão) na página
const cores = ["#234b70", "#6e3928", "#283b36", "#9b7845", "#81502b", "#254c62", "#59633c"];   // cores das capas dos livros novos

// Ao abrir a página, recupera o que ficou salvo no navegador:
let meusLivros = ler("meusLivros");                       // os livros que você cadastrou antes: entram na lista
meusLivros.forEach(livro => livros.push(livro));
const apagados = ler("apagados");                         // os ids dos livros que você excluiu: saem da lista
livros = livros.filter(livro => !apagados.includes(livro.id));

// --- "+ Adicionar livro" abre o formulário; "Cancelar" fecha ---
addButton.addEventListener("click", () => {
  addForm.reset();                  // limpa o formulário
  addMessage.textContent = "";      // limpa o aviso de erro
  addDialog.showModal();
});
document.querySelector("#cancel-add").addEventListener("click", () => addDialog.close());

// --- Enviar o formulário: valida, cria o livro, salva e redesenha ---
addForm.addEventListener("submit", evento => {
  evento.preventDefault();                          // não recarrega a página

  const campos = addForm.elements;                  // os campos do formulário, pelo "name" do HTML
  const titulo = campos.titulo.value.trim();        // .trim() tira espaços das pontas
  const autor = campos.autor.value.trim();
  const categoria = campos.categoria.value;
  const sinopse = campos.sinopse.value.trim();
  const pdfId = campos.pdfId.value.trim();          // opcional: pode ficar vazio

  // 1) Validação: se algo estiver errado, mostra o aviso e para por aqui (return)
  if (!titulo || !autor || !categoria || !sinopse) {
    addMessage.textContent = "Preencha título, autor, categoria e sinopse.";
    return;
  }
  const jaExiste = livros.some(livro =>             // .some(): existe ALGUM livro com o mesmo título e autor?
    livro.titulo.toLowerCase() === titulo.toLowerCase() && livro.autor.toLowerCase() === autor.toLowerCase());
  if (jaExiste) {
    addMessage.textContent = "Esse livro já está na estante.";
    return;
  }

  // 2) Cria o livro (mesmos campos dos outros). Date.now() (ms desde 1970) dá um id que não repete.
  const novo = { id: Date.now(), titulo, autor, categoria, sinopse, pdfId, capa: "", cor: cores[livros.length % cores.length] };
  livros.push(novo);

  // 3) Guarda no navegador, para o livro continuar lá depois de atualizar a página
  meusLivros.push(novo);
  salvar("meusLivros", meusLivros);

  // 4) Fecha a janela, avisa, e redesenha tudo (o .click() reaproveita o clique de categoria "Todas")
  addDialog.close();
  searchInput.value = "";
  termoBusca = "";
  document.querySelector('[data-category="Todas"]').click();
  addStatus.textContent = `"${titulo}" foi adicionado à estante.`;
});


// =====================================================================
// 9) EXCLUIR LIVRO
// =====================================================================
// O código NÃO consegue apagar o livro do arquivo. Então ele ANOTA o id do livro excluído
// (em "apagados") e esconde esse livro sempre que a página abre.
document.querySelector("#delete-button").addEventListener("click", () => {
  if (!confirm(`Excluir "${livroSelecionado.titulo}" da estante?`)) return;   // pergunta antes; se cancelar, para aqui

  apagados.push(livroSelecionado.id);                                         // anota o id do livro excluído
  salvar("apagados", apagados);
  livros = livros.filter(livro => livro.id !== livroSelecionado.id);          // tira da lista (filter cria uma lista nova, sem ele)
  meusLivros = meusLivros.filter(livro => livro.id !== livroSelecionado.id);  // se foi você que adicionou, tira dos salvos também
  salvar("meusLivros", meusLivros);

  addStatus.textContent = `"${livroSelecionado.titulo}" foi excluído.`;
  dialog.close();
  renderizarAcervo();
});


// =====================================================================
// 10) PRIMEIRO DESENHO DA ESTANTE
// =====================================================================
renderizarAcervo();   // desenha a estante pela primeira vez, já com tudo carregado