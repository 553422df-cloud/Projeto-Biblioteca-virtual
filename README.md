# 📚 Minha Biblioteca

Uma biblioteca online onde você pode **ver**, **buscar**, **adicionar**, **favoritar** e **excluir** livros.
Os livros ficam salvos no arquivo **`livros.json`**, e cada livro tem um link para ler o PDF.

---

## 📁 Os arquivos do projeto

| Arquivo       | O que faz                                                          |
|---------------|--------------------------------------------------------------------|
| `index.html`  | A estrutura da página (textos, botões, categorias e janelas)       |
| `style.css`   | O visual (cores, tamanhos e posições)                              |
| `script.js`   | A lógica da página (mostrar, filtrar, adicionar, excluir, favoritar) |
| `server.js`   | O servidor: lê e grava o `livros.json` e entrega o site           |
| `livros.json` | Onde os livros ficam salvos (título, autor, categoria, sinopse, PDF) |

---

## ▶️ Como executar o servidor

### 1. Instale o Node.js (só na primeira vez)

1. Entre em **https://nodejs.org**
2. Baixe a versão **LTS** e instale
3. Para conferir, abra o terminal e digite:
   ```
   node -v
   ```
   Se aparecer um número (exemplo: `v22.11.0`), está pronto.

### 2. Abra o terminal dentro da pasta do projeto

- **No VS Code:** `Arquivo → Abrir Pasta` → escolha a pasta do projeto → `Terminal → Novo Terminal`
- **No Windows:** abra a pasta, clique na barra de endereço, digite `cmd` e aperte Enter
- **No Mac:** clique com o botão direito na pasta → `Novo Terminal na Pasta`

### 3. Ligue o servidor

Digite no terminal e aperte Enter:
```
node server.js
```

Vai aparecer:
```
Biblioteca no ar: abra http://localhost:3000 no navegador
```

### 4. Abra o site

No navegador, acesse: **http://localhost:3000**

> ⚠️ **Não abra o `index.html` com dois cliques.** Sempre use o endereço acima.
> Deixe o terminal aberto enquanto usa o site.

### 5. Para desligar

Clique no terminal e aperte **Ctrl + C**.

> 💡 Mudou alguma coisa no `server.js`? Desligue (**Ctrl + C**) e ligue de novo (`node server.js`).
> O servidor só lê o código novo quando liga.

---

## ➕ Como adicionar um livro

1. Clique no botão **"+ Adicionar livro"** (ao lado de "Ordenar por")
2. Preencha o formulário:
   - **Título** (obrigatório)
   - **Autor** (obrigatório)
   - **Categoria** (obrigatório)
   - **Sinopse** (obrigatório)
   - **Link do PDF** (opcional). Se colocar, aparece o botão "Ler agora".
3. Clique em **"Adicionar livro"**
4. Pronto! O livro aparece na estante e fica salvo no `livros.json`.

> Se faltar algum campo obrigatório, aparece: *"Preencha título, autor, categoria e sinopse."*
> Se o livro já existir (mesmo título e autor), aparece: *"Esse livro já está na estante."*

---

## 🗑️ Como excluir um livro

1. Clique no **livro** que você quer excluir, na estante
2. Na janela que abrir, clique em **"Excluir livro"**
3. Confirme clicando em **OK**
4. Pronto! O livro sai da estante e é apagado do `livros.json`.

> Clicou sem querer? Clique em **Cancelar** na confirmação e nada é apagado.

---

## ⭐ Outras funções

- **Ler o livro:** clique no livro → **"▤ Ler agora"** (o PDF abre numa nova aba)
- **Favoritar:** clique no livro → **"♡ Adicionar aos favoritos"**
- **Filtrar por categoria:** clique em um dos cartões de categoria (Romance, Filosofia...)
- **Buscar:** digite o título, o autor ou a categoria na barra de busca, no topo
- **Ordenar:** use o menu **"Ordenar por"** (título ou autor)

---

## 🔄 Como funciona por dentro

```
Página (script.js)  <-->  Servidor (server.js)  <-->  livros.json
```

O navegador não pode gravar arquivos no computador (é uma regra de segurança).
Por isso a página pede ao servidor, e o servidor lê ou grava o `livros.json`:

| Você...                               | A página pede  | O servidor...                        |
|---------------------------------------|----------------|--------------------------------------|
| abre o site                           | `GET /livros`  | lê o `livros.json` e devolve a lista |
| adiciona, exclui ou favorita um livro | `POST /livros` | grava a lista nova no `livros.json`  |

No `script.js`, isso acontece em duas funções:
- **`carregarLivros()`** busca os livros (GET)
- **`salvarLivros()`** manda a lista inteira para ser gravada (POST)

E a função **`renderizarAcervo()`** desenha a estante sempre que algo muda.

### Como um livro fica guardado no `livros.json`

```json
{
  "id": 1792104006008,
  "titulo": "Dom Casmurro",
  "autor": "Machado de Assis",
  "categoria": "Romance",
  "sinopse": "Narrado em primeira pessoa pelo já idoso Bento Santiago...",
  "pdf": "https://drive.google.com/file/d/.../view",
  "cor": "#6E3928",
  "favorito": false
}
```

| Campo       | O que é                                                    |
|-------------|------------------------------------------------------------|
| `id`        | Número único do livro (usado para excluir)                 |
| `titulo`    | O título                                                   |
| `autor`     | O autor                                                    |
| `categoria` | Precisa ser **igual** ao `data-category` de um botão do HTML |
| `sinopse`   | O resumo que aparece na janela de detalhes                 |
| `pdf`       | O link do PDF (pode ficar vazio: `""`)                     |
| `cor`       | A cor da capa                                              |
| `favorito`  | `true` = favorito, `false` = não é                         |

---

## ❓ Problemas comuns

| O que aparece                                    | O que fazer                                                          |
|--------------------------------------------------|----------------------------------------------------------------------|
| `'node' não é reconhecido` / `command not found` | Instale o Node.js e **feche e abra o terminal de novo**              |
| `Cannot find module ... server.js`               | O terminal não está na pasta do projeto. Abra ele dentro da pasta    |
| `EADDRINUSE`                                     | O servidor já está ligado em outro terminal. Use esse ou feche-o     |
| A página mostra "Servidor desligado"             | Ligue o servidor (`node server.js`) e abra **http://localhost:3000** |
| Uma categoria aparece vazia                      | Confira se a `categoria` dos livros no `livros.json` é **igual** ao `data-category` do botão |
| Uma imagem não aparece                           | O servidor só entrega os arquivos que estão liberados no `server.js` |

---

## 🧹 Para começar do zero

Desligue o servidor (**Ctrl + C**) e apague o arquivo `livros.json`.
Quando o servidor ligar de novo, ele cria um `livros.json` novo e vazio.

> ⚠️ Isso apaga **todos** os livros. Se quiser guardar, faça uma cópia do `livros.json` antes.
