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
    2) DESENHAR .... a função renderizarAcervo() apaga a estante e desenha de novo
                     só os livros que devem aparecer
    3) EVENTOS ..... clicar, digitar, enviar um formulário: cada evento só MUDA UM DADO
                     e chama a função de desenhar de novo

  O arquivo roda UMA vez, de cima para baixo: define tudo, registra os eventos e,
  na última linha, desenha a estante pela primeira vez. Depois a página fica
  esperando o usuário clicar ou digitar.

  ORDEM DO ARQUIVO
    1. Dados: a lista de livros
    2. Elementos da página (pegos pelo id que está no HTML)
    3. Estado: o que a página "lembra"
    4. Funções de apoio
    5. Desenhar a estante
    6. Janela de detalhes do livro
    7. Eventos (categorias, busca, ordem, favoritos, janela)
    8. Adicionar livro pelo site
    9. Excluir livro
   10. Primeiro desenho da estante
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
// 2) ELEMENTOS DA PÁGINA
// =====================================================================
// document.querySelector("#nome") procura, no HTML, o elemento com id="nome"
// (o # significa "id") e guarda numa variável. Assim o JavaScript consegue
// ler e mudar esse elemento depois.

// --- a estante e os controles ---
const bookshelf = document.querySelector("#bookshelf");               // a caixa VAZIA onde os livros são desenhados
const categoryGrid = document.querySelector("#category-grid");        // o grupo com os botões de categoria
const searchForm = document.querySelector("#search-form");            // o formulário da barra de busca (no topo)
const searchInput = document.querySelector("#search-input");          // o campo onde se digita a busca
const sortSelect = document.querySelector("#sort-select");            // o menu "Ordenar por"
const collectionTitle = document.querySelector("#collection-title");  // o título "Estante: ..."
const resultsCount = document.querySelector("#results-count");        // o texto "X livros encontrados"
const emptyState = document.querySelector("#empty-state");            // a mensagem "Nenhum livro encontrado" (começa escondida)

// --- a janela de detalhes do livro ---
const dialog = document.querySelector("#book-dialog");                // a janela (<dialog>) de detalhes
const dialogCover = document.querySelector("#dialog-cover");          // o espaço da capa dentro da janela
const dialogTitle = document.querySelector("#dialog-title");          // o título do livro na janela
const dialogAuthor = document.querySelector("#dialog-author");        // o autor na janela
const dialogCategory = document.querySelector("#dialog-category");    // a categoria na janela
const dialogSynopsis = document.querySelector("#dialog-synopsis");    // a sinopse na janela
const readLink = document.querySelector("#read-link");                // o botão/link "Ler agora"
const favoriteButton = document.querySelector("#favorite-button");    // o botão de favorito
const dialogHelp = document.querySelector("#dialog-help");            // o texto de ajuda embaixo dos botões


// =====================================================================
// 3) ESTADO: o que a página "lembra"
// =====================================================================
let categoriaAtiva = "Todas";    // categoria escolhida agora ("Todas" = sem filtro)
let termoBusca = "";             // o texto digitado na busca
let livroSelecionado = null;     // o livro aberto na janela de detalhes (null = nenhum)
const favoritos = new Set();     // lista SEM repetidos com os ids dos favoritos. Fica só na memória: some ao atualizar a página

// =====================================================================
// 4) FUNÇÕES DE APOIO
// =====================================================================

// escaparHTML: deixa um texto SEGURO antes de colocá-lo dentro de HTML montado como texto (innerHTML).
// Troca os 5 caracteres perigosos (& < > " ') por versões inofensivas, para o navegador
// nunca tratar o texto como código HTML.
function escaparHTML(valor = "") {                                        // valor = "" é o padrão, se nada for passado
  return String(valor).replace(/[&<>"']/g, caractere => ({                // para cada caractere perigoso encontrado...
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"   // ...esta tabela diz por qual texto trocar
  })[caractere]);
}

// urlPDF: monta o link de leitura do PDF no Google Drive a partir do pdfId do livro.
// Devolve "" (texto vazio) quando o livro ainda não tem PDF.

function urlPDF(livro) {
  return livro.pdfId || "";
}


// urlCapa: devolve o caminho da imagem de capa do livro, ou "" se ele não tiver imagem.
function urlCapa(livro) {
  if (livro.capa) return livro.capa;          // tem imagem: devolve o caminho dela
  // Capa demonstrativa criada em CSS. Para uma imagem real, preencha o campo "capa".
  return "";          // sem imagem: devolve vazio
}

// livrosVisiveis: devolve a lista dos livros que devem aparecer AGORA,
// já na ordem certa. Considera a categoria escolhida, o texto da busca e a ordenação.
function livrosVisiveis() {
  const termo = termoBusca.toLocaleLowerCase("pt-BR");       // busca em minúsculas, para não importar maiúscula/minúscula
  return livros.filter(livro => {                                         // filter: guarda só os livros em que a função devolver true
    const correspondeCategoria = categoriaAtiva === "Todas" || livro.categoria === categoriaAtiva;   // teste 1: a categoria combina?
    const texto = `${livro.titulo} ${livro.autor} ${livro.categoria} ${livro.sinopse}`.toLocaleLowerCase("pt-BR");   // junta tudo num texto só
    return correspondeCategoria && texto.includes(termo);                 // teste 2: o texto contém a busca? Os DOIS testes precisam passar
  }).sort((a, b) => {                                                     // sort: ordena a lista que sobrou
    const campo = sortSelect.value === "author" ? "autor" : "titulo";     // ordena por autor ou por título, conforme o menu
    return a[campo].localeCompare(b[campo], "pt-BR");                     // compara respeitando acentos do português
  });
}


// =====================================================================
// 5) DESENHAR A ESTANTE
// =====================================================================

// criarLivro: cria o BOTÃO de um livro (capa + legenda). Só CRIA e devolve o botão:
// quem coloca na tela é a função renderizarAcervo.
function criarLivro(livro) {
  const botao = document.createElement("button");     // cria um <button> (ainda fora da página)
  botao.type = "button";                              // botão comum (não envia formulário)
  botao.className = "book";                           // dá a classe "book", que o CSS usa para estilizar
  botao.setAttribute("aria-label", `Ver detalhes de ${livro.titulo}, por ${livro.autor}`);   // texto lido por leitores de tela

  // Monta o conteúdo da capa. Se o livro tem imagem (capa), usa uma <img>.
  // Se não tem, monta a capa colorida com o ornamento ✦, o título e o autor.
  // (escaparHTML deixa os textos seguros antes de entrarem no HTML.)
  const capa = urlCapa(livro);
  const conteudoCapa = capa
    ? `<img src="${escaparHTML(capa)}" alt="" style="width:100%;height:100%;object-fit:cover">`
    : `<span class="cover-ornament" aria-hidden="true">✦</span>
       <span class="cover-title">${escaparHTML(livro.titulo)}</span>
       <span class="cover-author">${escaparHTML(livro.autor)}</span>`;

  // Coloca dentro do botão: a capa (com a cor do livro; se não tiver cor, usa "#28443d")
  // e a legenda (título e autor) embaixo.
  botao.innerHTML = `
    <span class="book-cover" style="background:${escaparHTML(livro.cor || "#28443d")}">${conteudoCapa}</span>
    <span class="book-caption">
      <strong>${escaparHTML(livro.titulo)}</strong>
      <span>${escaparHTML(livro.autor)}</span>
    </span>`;
  botao.addEventListener("click", () => abrirDetalhes(livro));   // clicar no livro abre a janela de detalhes
  return botao;                                                  // devolve o botão pronto
}

// renderizarAcervo: DESENHA a estante. É a função mais importante do arquivo:
// sempre que algo muda (categoria, busca, ordem, livro novo ou excluído), ela é chamada de novo.
function renderizarAcervo() {
  const resultado = livrosVisiveis();                 // 1) pega os livros que devem aparecer agora
  bookshelf.replaceChildren();                        // 2) apaga tudo o que estava na estante

  resultado.forEach((livro, indice) => {              // 3) para cada livro (indice = posição dele: 0, 1, 2...)
    bookshelf.appendChild(criarLivro(livro));         //    cria o botão do livro e coloca na estante
    // A cada 5 livros (e se não for o último), coloca uma tábua decorativa de prateleira:
    if ((indice + 1) % 5 === 0 && indice !== resultado.length - 1) {
      const prateleira = document.createElement("div");   // cria a tábua
      prateleira.className = "shelf-board";               // classe usada pelo CSS
      prateleira.setAttribute("aria-hidden", "true");     // é só decoração: leitores de tela ignoram
      bookshelf.appendChild(prateleira);                  // coloca a tábua na estante
    }
  });

  emptyState.hidden = resultado.length > 0;           // 4) mostra "Nenhum livro encontrado" só quando a lista está vazia
  resultsCount.textContent = `${resultado.length} ${resultado.length === 1 ? "livro encontrado" : "livros encontrados"}`;   // 5) contagem, com singular e plural
  collectionTitle.textContent = `Estante: ${categoriaAtiva}`;     // 6) título da estante
}


// =====================================================================
// 6) JANELA DE DETALHES DO LIVRO
// =====================================================================

// abrirDetalhes: preenche a janela com os dados do livro clicado e abre ela.
function abrirDetalhes(livro) {
  livroSelecionado = livro;                           // guarda qual livro está aberto (favoritos e exclusão usam isso)
  dialogTitle.textContent = livro.titulo;             // textContent coloca TEXTO em um elemento (de forma segura)
  dialogAuthor.textContent = livro.autor;
  dialogCategory.textContent = livro.categoria;
  dialogSynopsis.textContent = livro.sinopse;

  // --- A capa dentro da janela ---
  const capa = urlCapa(livro);
  if (capa) {                                         // tem imagem: mostra a imagem
    dialogCover.src = capa;
    dialogCover.alt = `Capa de ${livro.titulo}`;      // texto alternativo (leitores de tela)
    dialogCover.style.display = "block";
  } else {
    // Sem imagem: pinta o espaço da capa com a cor do livro (capa "de demonstração").
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

  // --- O botão "Ler agora" ---

const pdf = urlPDF(livro);

readLink.href = pdf || "#";
readLink.setAttribute("aria-disabled", String(!pdf));
readLink.style.opacity = pdf ? "1" : ".55";

readLink.onclick = function (event) {
  event.preventDefault();

  if (!pdf) {
    alert("Este livro ainda não possui um link de PDF.");
    return;
  }

  window.open(pdf, "_blank");
};

  dialogHelp.textContent = pdf                        // texto de ajuda, conforme tenha PDF ou não
    ? "O PDF será aberto em uma nova aba. O acesso depende das permissões do Google Drive."
    : "Adicione o ID real do PDF no script.js para ativar a leitura deste livro.";

  atualizarBotaoFavorito();                           // deixa o botão de favorito com o texto certo
  dialog.showModal();                                 // ABRE a janela (com fundo escuro; Esc fecha sozinho)
}

// atualizarBotaoFavorito: troca o texto do botão entre "♡ Adicionar" e "♥ Remover",
// conforme o livro aberto já esteja ou não nos favoritos.
function atualizarBotaoFavorito() {
  if (!livroSelecionado) return;                                      // se não há livro aberto, não faz nada
  const favorito = favoritos.has(livroSelecionado.id);                // .has() pergunta: este id está no Set?
  favoriteButton.textContent = favorito ? "♥ Remover dos favoritos" : "♡ Adicionar aos favoritos";
  favoriteButton.setAttribute("aria-pressed", String(favorito));      // informa leitores de tela se está "ligado"
}


// =====================================================================
// 7) EVENTOS: o que acontece quando o usuário clica ou digita
// =====================================================================

// --- Clique em um botão de categoria ---
// Um único "ouvinte" no grupo todo (em vez de um em cada botão).
categoryGrid.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-category]");   // qual botão de categoria foi clicado? (closest sobe até achar)
  if (!botao) return;                                       // clicou fora de um botão: ignora
  categoriaAtiva = botao.dataset.category;                  // lê o data-category do HTML e guarda como categoria ativa
  categoryGrid.querySelectorAll("[data-category]").forEach(item => {   // para cada botão de categoria:
    item.classList.toggle("selected", item === botao);                 //   só o clicado fica destacado (classe "selected")
    item.setAttribute("aria-pressed", String(item === botao));         //   e avisa leitores de tela qual está selecionado
  });
  renderizarAcervo();                                       // redesenha a estante com a nova categoria
  document.querySelector("#acervo").scrollIntoView({ behavior: "smooth", block: "start" });   // rola a página até a estante
});

// --- Enviar a busca (Enter no campo, ou clique na lupa) ---
searchForm.addEventListener("submit", evento => {
  evento.preventDefault();                                  // impede o navegador de recarregar a página (comportamento padrão do formulário)
  termoBusca = searchInput.value.trim();                    // guarda o texto digitado (sem espaços nas pontas)
  renderizarAcervo();                                       // redesenha a estante
  document.querySelector("#acervo").scrollIntoView({ behavior: "smooth", block: "start" });   // rola até a estante
});

// --- Digitar no campo de busca (a cada letra): é a busca "ao vivo" ---
searchInput.addEventListener("input", () => {
  termoBusca = searchInput.value.trim();                    // guarda o texto atual
  renderizarAcervo();                                       // redesenha a cada letra digitada
});

// --- Mudar o menu "Ordenar por" ---
// Só redesenha: a função livrosVisiveis já lê o menu sozinha.
sortSelect.addEventListener("change", renderizarAcervo);

// --- Clicar no botão de favorito (dentro da janela) ---
favoriteButton.addEventListener("click", () => {
  if (!livroSelecionado) return;                            // sem livro aberto, não faz nada
  if (favoritos.has(livroSelecionado.id)) favoritos.delete(livroSelecionado.id);   // já era favorito: tira
  else favoritos.add(livroSelecionado.id);                                         // não era: coloca
  atualizarBotaoFavorito();                                 // atualiza o texto do botão
});

// --- Clicar em "Ler agora" ---
// Se o livro não tem PDF, cancela o clique (senão o link "#" faria a página pular).
readLink.addEventListener("click", evento => {
  if (!urlPDF(livroSelecionado || {})) evento.preventDefault();
});

// --- Clicar na janela de detalhes ---
dialog.addEventListener("click", evento => {
  // Fecha ao clicar no fundo escurecido, fora da caixa de diálogo.
  // (evento.target === dialog só é verdade quando o clique foi no fundo, não no conteúdo.)
  if (evento.target === dialog) dialog.close();
});


// =====================================================================
// 8) ADICIONAR LIVRO PELO SITE
// =====================================================================

// --- Elementos do formulário de novo livro ---
const addButton = document.querySelector("#add-book-button");   // o botão "+ Adicionar livro"
const addDialog = document.querySelector("#add-dialog");        // a janela do formulário
const addForm = document.querySelector("#add-form");            // o formulário em si
const addMessage = document.querySelector("#add-message");      // o aviso de erro dentro da janela
const addStatus = document.querySelector("#add-status");        // o aviso de sucesso (e de exclusão) na página
const cores = ["#234b70", "#6e3928", "#283b36", "#9b7845", "#81502b", "#254c62", "#59633c"];   // cores para as capas dos livros novos

// --- Na abertura da página: recupera o que ficou salvo no navegador ---
// O localStorage guarda só TEXTO no navegador. JSON.parse transforma o texto de volta em lista.
// O  || "[]"  é o valor padrão quando ainda não existe nada salvo.
// Os livros que você cadastrou antes ficam salvos no navegador (localStorage). Coloca eles na lista.
let meusLivros = JSON.parse(localStorage.getItem("meusLivros") || "[]");
meusLivros.forEach(livro => livros.push(livro));          // coloca cada livro salvo na lista "livros"

// Os livros que você excluiu ficam anotados no navegador (só o id de cada um). Tira eles da lista.
const apagados = JSON.parse(localStorage.getItem("apagados") || "[]");
livros = livros.filter(livro => !apagados.includes(livro.id));   // fica só com os livros cujo id NÃO está em "apagados"

// --- Clicar em "+ Adicionar livro": abre o formulário ---
addButton.addEventListener("click", () => {
  addForm.reset();                  // limpa o formulário
  addMessage.textContent = "";      // limpa o aviso de erro
  addDialog.showModal();            // abre a janela
});

// --- Clicar em "Cancelar": fecha o formulário ---
document.querySelector("#cancel-add").addEventListener("click", () => addDialog.close());

// --- Enviar o formulário: valida, cria o livro, salva e redesenha ---
addForm.addEventListener("submit", evento => {
  evento.preventDefault();          // não recarrega a página

  // Lê o que foi digitado em cada campo (pelo atributo "name" do HTML):
  const campos = addForm.elements;  // os campos do formulário, pelo "name"
  const titulo = campos.titulo.value.trim();       // .trim() tira espaços das pontas
  const autor = campos.autor.value.trim();
  const categoria = campos.categoria.value;
  const sinopse = campos.sinopse.value.trim();
  const pdfId = campos.pdfId.value.trim();         // opcional: pode ficar vazio

  // 1) Validação: se algo estiver errado, mostra o aviso e para por aqui
  if (!titulo || !autor || !categoria || !sinopse) {                       // "!titulo" é verdadeiro quando o texto está vazio
    addMessage.textContent = "Preencha título, autor, categoria e sinopse.";
    return;                                                                // return = para a função aqui (nada é criado)
  }
  // .some() pergunta: existe ALGUM livro com o mesmo título e autor (ignorando maiúsculas)?
  const jaExiste = livros.some(livro =>
    livro.titulo.toLowerCase() === titulo.toLowerCase() && livro.autor.toLowerCase() === autor.toLowerCase());
  if (jaExiste) {
    addMessage.textContent = "Esse livro já está na estante.";
    return;
  }

  // 2) Cria o livro (com os mesmos campos dos outros) e coloca na lista
  //    id: Date.now() = milissegundos desde 1970, na prática nunca se repete
  //    cor: o % faz as cores se repetirem em ciclo, conforme o número de livros
  const novo = { id: Date.now(), titulo, autor, categoria, sinopse, pdfId, capa: "", cor: cores[livros.length % cores.length] };
  livros.push(novo);                                                       // .push() coloca no final da lista

  // 3) Guarda no navegador, para o livro continuar lá depois de atualizar a página
  //    JSON.stringify transforma a lista em texto (o localStorage só guarda texto)
  meusLivros.push(novo);
  localStorage.setItem("meusLivros", JSON.stringify(meusLivros));

  // 4) Fecha a janela, avisa que deu certo e desenha a estante com todos os livros
  addDialog.close();                                                       // fecha o formulário
  searchInput.value = "";                                                  // limpa o campo de busca na tela
  termoBusca = "";                                                         // e a busca guardada
  document.querySelector('[data-category="Todas"]').click();               // "clica" em Todas: reaproveita o evento de categoria (redesenha e rola até a estante)
  addStatus.textContent = `"${titulo}" foi adicionado à estante.`;         // mensagem de sucesso
});


// =====================================================================
// 9) EXCLUIR LIVRO
// =====================================================================
const deleteButton = document.querySelector("#delete-button");   // o botão "Excluir livro" (dentro da janela de detalhes)

// --- Clicar em "Excluir livro" ---
deleteButton.addEventListener("click", () => {
  // confirm() abre a pergunta do navegador e devolve true (OK) ou false (Cancelar).
  if (!confirm(`Excluir "${livroSelecionado.titulo}" da estante?`)) return;   // pergunta antes de apagar; se cancelar, para aqui

  // O código NÃO consegue apagar o livro do arquivo. Então ele ANOTA o id do livro excluído
  // (em "apagados") e esconde esse livro sempre que a página abre.
  apagados.push(livroSelecionado.id);                                         // anota o id do livro excluído
  localStorage.setItem("apagados", JSON.stringify(apagados));                 // guarda no navegador
  livros = livros.filter(livro => livro.id !== livroSelecionado.id);          // tira o livro da lista (filter cria uma lista nova, sem ele)
  meusLivros = meusLivros.filter(livro => livro.id !== livroSelecionado.id);   // se foi você que adicionou, tira dos salvos também
  localStorage.setItem("meusLivros", JSON.stringify(meusLivros));

  addStatus.textContent = `"${livroSelecionado.titulo}" foi excluído.`;      // mensagem na página
  dialog.close();                                                             // fecha a janela de detalhes
  renderizarAcervo();                                                         // redesenha a estante sem o livro
});


// =====================================================================
// 10) PRIMEIRO DESENHO DA ESTANTE
// =====================================================================
// Última linha do arquivo: desenha a estante pela primeira vez, já com tudo carregado
// (os livros da lista, os que você cadastrou, menos os que você excluiu).
renderizarAcervo();