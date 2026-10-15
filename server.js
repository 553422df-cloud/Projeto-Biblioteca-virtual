/*
  =====================================================================
  SERVIDOR — server.js
  =====================================================================
  O navegador NÃO pode gravar arquivos no computador (regra de segurança).
  Por isso existe este servidor: ele fica no meio do caminho.

      Página (script.js)  <->  Servidor (este arquivo)  <->  livros.json

  Ele faz só 3 coisas:
    1) GET  /livros  -> LÊ o livros.json e manda para a página
    2) POST /livros  -> RECEBE a lista da página e GRAVA no livros.json
    3) Qualquer outro endereço -> entrega os arquivos do site (index.html, style.css, script.js)

  COMO LIGAR: abra o terminal nesta pasta e digite:   node server.js
  Depois abra no navegador:                            http://localhost:3000
*/

// Ferramentas que já vêm com o Node (não precisa instalar nada)
const http = require("http");   // cria o servidor
const fs = require("fs");       // lê e grava arquivos ("fs" = file system)
const path = require("path");   // monta caminhos de arquivos

const PORTA = 3000;                                    // o "número da porta": localhost:3000
const ARQUIVO = path.join(__dirname, "livros.json");   // o caminho do nosso "banco de dados"

// Se o livros.json não existir, cria ele com uma lista vazia
if (!fs.existsSync(ARQUIVO)) fs.writeFileSync(ARQUIVO, "[]");

// Os arquivos do site que o servidor pode entregar, e o tipo de cada um
const ARQUIVOS_DO_SITE = {
  "/": ["index.html", "text/html; charset=utf-8"],
  "/index.html": ["index.html", "text/html; charset=utf-8"],
  "/style.css": ["style.css", "text/css; charset=utf-8"],
  "/script.js": ["script.js", "text/javascript; charset=utf-8"]
};

// Esta função roda TODA VEZ que o navegador pede alguma coisa.
// "pedido" = o que o navegador pediu | "resposta" = o que vamos devolver
const servidor = http.createServer((pedido, resposta) => {

  // 1) GET /livros: a página quer a lista de livros -> lê o arquivo e devolve
  if (pedido.url === "/livros" && pedido.method === "GET") {
    resposta.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    resposta.end(fs.readFileSync(ARQUIVO));
    return;
  }

  // 2) POST /livros: a página mandou a lista nova -> grava no arquivo
  if (pedido.url === "/livros" && pedido.method === "POST") {
    let corpo = "";
    pedido.setEncoding("utf8");                          // para os acentos chegarem certos
    pedido.on("data", pedaco => corpo += pedaco);        // os dados chegam em pedaços: vamos juntando
    pedido.on("end", () => {                             // chegou tudo:
      try {
        const lista = JSON.parse(corpo);                 // texto -> lista (se não for JSON válido, vai para o catch)
        fs.writeFileSync(ARQUIVO, JSON.stringify(lista, null, 2));   // grava bonito (com espaços) no arquivo
        resposta.end("ok");
      } catch {
        resposta.writeHead(400);                         // 400 = "pedido errado"
        resposta.end("Dados inválidos");
      }
    });
    return;
  }

  // 3) Arquivos do site (index.html, style.css, script.js)
  const arquivo = ARQUIVOS_DO_SITE[pedido.url];
  if (arquivo) {
    const [nome, tipo] = arquivo;
    resposta.writeHead(200, { "Content-Type": tipo });
    resposta.end(fs.readFileSync(path.join(__dirname, nome)));
    return;
  }

  // Nada disso: endereço não existe
  resposta.writeHead(404);   // 404 = "não encontrado"
  resposta.end("Não encontrado");
});

// Liga o servidor
servidor.listen(PORTA, () => {
  console.log(`Biblioteca no ar: abra http://localhost:${PORTA} no navegador`);
});
