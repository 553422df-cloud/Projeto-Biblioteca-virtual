# 📚 Minha Biblioteca

Uma biblioteca online onde você pode **adicionar**, **ver**, **favoritar** e **excluir** livros.
Os livros ficam salvos num banco de dados **SQLite** (o arquivo `db.sqlite`).

---

## 📁 Os arquivos do projeto

| Arquivo      | O que faz                                                    |
|--------------|--------------------------------------------------------------|
| `index.html` | A estrutura da página (textos, botões e janelas)             |
| `style.css`  | O visual (cores, tamanhos e posições)                        |
| `script.js`  | A lógica da página (mostrar, filtrar, adicionar e excluir)   |
| `server.js`  | O servidor: recebe os pedidos da página e salva no banco     |
| `db.sqlite`  | O banco de dados. **É criado sozinho** quando o servidor liga |

---

## ▶️ Como executar o servidor

### 1. Instale o Node.js (só na primeira vez)

1. Entre em **https://nodejs.org**
2. Baixe a versão **LTS** e instale
3. Para conferir, abra o terminal e digite:
   ```
   node -v
   ```
   Se aparecer um número (exemplo: `v22.13.0` ou maior), está pronto.

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
Biblioteca no ar! Abra no navegador: http://localhost:3000
```

> O aviso `ExperimentalWarning: SQLite is an experimental feature` é normal. Pode ignorar.

### 4. Abra o site

No navegador, acesse: **http://localhost:3000**

> ⚠️ **Não abra o `index.html` com dois cliques.** Sempre use o endereço acima.
> Deixe o terminal aberto enquanto usa o site.

### 5. Para desligar

Clique no terminal e aperte **Ctrl + C**.

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
4. Pronto! O livro aparece na estante e fica salvo no banco de dados.

> Se faltar algum campo obrigatório, aparece: *"Preencha título, autor, categoria e sinopse."*
> Se o livro já existir (mesmo título e autor), aparece: *"Esse livro já está na estante."*

---

## 🗑️ Como excluir um livro

1. Clique no **livro** que você quer excluir, na estante
2. Na janela que abrir, clique em **"Excluir livro"**
3. Confirme clicando em **OK**
4. Pronto! O livro sai da estante e é apagado do banco de dados.

> Clicou sem querer? Clique em **Cancelar** na confirmação e nada é apagado.

---

## ⭐ Outras funções

- **Favoritar:** clique no livro → **"♡ Adicionar aos favoritos"**
- **Filtrar por categoria:** clique em um dos cartões de categoria (Terror, Romance...)
- **Buscar:** digite o título ou o autor na barra de busca, no topo
- **Ordenar:** use o menu **"Ordenar por"** (título ou autor)

---

## 🔄 Como funciona por dentro

```
Página (script.js)  <-->  Servidor (server.js)  <-->  Banco (db.sqlite)
```

O navegador não pode abrir arquivos do computador (é uma regra de segurança).
Por isso a página faz um pedido ao servidor, e o servidor executa o comando SQL no banco:

| Você...            | A página pede        | O servidor executa no banco         |
|--------------------|----------------------|-------------------------------------|
| abre o site        | `GET /livros`        | `SELECT * FROM livros`              |
| adiciona um livro  | `POST /livros`       | `INSERT INTO livros ...`            |
| favorita um livro  | `PUT /livros/5`      | `UPDATE livros SET favorito = ...`  |
| exclui um livro    | `DELETE /livros/5`   | `DELETE FROM livros WHERE id = 5`   |

---

## ❓ Problemas comuns

| O que aparece                               | O que fazer                                                       |
|---------------------------------------------|-------------------------------------------------------------------|
| `'node' não é reconhecido` / `command not found` | Instale o Node.js e **feche e abra o terminal de novo**       |
| `Cannot find module ... server.js`          | O terminal não está na pasta do projeto. Abra ele dentro da pasta |
| `EADDRINUSE`                                | O servidor já está ligado em outro terminal. Use esse ou feche-o  |
| A página mostra "Servidor desligado"        | Ligue o servidor (`node server.js`) e abra **http://localhost:3000** |