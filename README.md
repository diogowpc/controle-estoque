# Controle de Estoque

**Aluno(a):** Diogo Wescley 
**Tema:** Controle de Estoque

## Sobre o projeto

App de controle de estoque feito em HTML, CSS e JavaScript. O app organiza os produtos em categorias (Hortifruti, Açougue, Padaria, Bebidas e Doces). Dentro de cada categoria dá pra:

- Ver a lista de produtos, com quantidade e data de validade
- Ver o status de validade de cada produto (dentro da validade, próximo de vencer ou vencido), calculado automaticamente em cima da data de hoje
- Adicionar um produto novo
- Editar um produto existente
- Excluir um produto

Tudo é salvo no `localStorage`, então se você fechar a aba e abrir de novo, os produtos continuam lá.

## Estrutura dos arquivos

```
controle-estoque/
├── index.html      → estrutura das telas e do formulário
├── style.css       → todo o visual (telas, animações, cards, formulário)
├── script.js       → toda a lógica (estoque, eventos, localStorage)
└── img/            → ícones das categorias (svg)
```

O app tem duas "telas" (`screen-home` e `categorias-screen`) dentro de um `.wrapper` com `overflow: hidden`. Quando você clica numa categoria ou no menu, o JS adiciona a classe `show-categoria` no wrapper, e o CSS faz as telas deslizarem com `transform: translateX(-100%)` — não é troca de página nem `display: none`, é tudo a mesma página com um efeito de "slide".

## Como os dados são armazenados e renderizados

Os produtos ficam guardados num objeto JavaScript chamado `estoque`, onde cada chave é o nome de uma categoria e o valor é um array de produtos:

```js
const estoque = {
    Hortifruti: [
        { nome: "Banana", quantidade: 20, validade: "2026-08-10" },
        ...
    ],
    Açougue: [...],
    ...
};
```

Esse objeto é a "fonte da verdade" do app — tudo que aparece na tela é gerado a partir dele, nunca é editado direto no HTML.

Quando você clica numa categoria, a função `abrirCategoria(nome, icone)` faz o seguinte:

1. Limpa o conteúdo atual da lista (`produtos.innerHTML = ""`)
2. Pega o array daquela categoria dentro do objeto `estoque`
3. Para cada produto do array, monta um bloco de HTML (template string) com nome, quantidade, validade formatada e o status de validade, e injeta isso via `innerHTML` dentro de um `div` novo
4. Esse `div` é adicionado na lista com `produtos.appendChild(item)`
5. Só depois de o elemento existir de verdade no DOM é que os eventos de clique dos botões "editar" e "excluir" daquele item são registrados — porque eles são criados na hora, não dá pra colocar o evento antes de o elemento existir

Ou seja: a tela nunca guarda estado nenhum sozinha, ela é só um reflexo do objeto `estoque`. Toda vez que algo muda (adiciona, edita, exclui), a função `abrirCategoria` é chamada de novo pra redesenhar a lista do zero com os dados atualizados.

## Como funcionam os principais eventos

**Adicionar** : o botão `+` (`.add-produto-btn`) alterna a classe `active` no formulário, no próprio botão e no fundo escurecido (`backdrop`). Quando o formulário está com `active`, o CSS muda a posição dele de `bottom: -100%` (fora da tela) pra `bottom: 0`, com uma transição suave — é o efeito de "puxar" o formulário de baixo pra cima. Ao clicar em "Adicionar produto", o botão `salvarBtn` lê os valores dos inputs, valida se todos foram preenchidos, monta um objeto `novoProduto` e dá um `push` no array da categoria escolhida dentro de `estoque`. Depois chama `salvarEstoque()` (localStorage) e `atualizarContadores()`, fecha o formulário e limpa os campos.

**Editar** : cada produto renderizado tem um botão de editar. Ao clicar, o app entra em "modo edição": guarda o índice e a categoria do produto (`indiceEditando`, `categoriaEditando`), preenche o formulário com os dados atuais e abre o mesmo modal de adicionar (é o mesmo formulário reaproveitado, só que já vem preenchido). Ao salvar, se `editando` estiver `true`, o código remove o item antigo (`splice`) e insere o item atualizado — inclusive permite mudar o produto de categoria, já que ele é removido de uma lista e colocado em outra.

**Excluir** : cada produto tem um botão de excluir que, no clique, tira o item do array com `splice(index, 1)`, salva no localStorage, atualiza os contadores e re-renderiza a categoria.

## Como o localStorage é usado

Duas funções cuidam disso:

- `salvarEstoque()` transforma o objeto `estoque` inteiro em texto com `JSON.stringify` e salva no localStorage na chave `"estoque"`. Ela é chamada toda vez que algo muda: adicionar, editar ou excluir um produto.
- `carregarEstoque()` faz o caminho contrário: pega o texto salvo no localStorage, transforma de volta em objeto com `JSON.parse` e usa `Object.assign(estoque, ...)` pra sobrescrever o objeto `estoque` inicial com os dados salvos. Essa função roda uma única vez, lá no final do `script.js`, assim que a página carrega.

Como o localStorage guarda só texto, não dá pra salvar o objeto direto — por isso o vai-e-volta de `JSON.stringify` / `JSON.parse`.

## Dificuldade que tive

A parte que mais me travou foi fazer o formulário de "Adicionar produto" aparecer na tela. No começo eu fiquei tentando resolver isso pelo JavaScript, achando que precisava mostrar/esconder o elemento manualmente (tipo mexendo em `display` ou coisa do tipo). Depois de mexer um pouco entendi que o formulário já existe sempre no HTML, ele só fica escondido porque o CSS coloca ele com `bottom: -100%` (empurrado pra fora da tela, embaixo). O JS não precisa "criar" nem "mostrar" nada: ele só precisa adicionar a classe `active` no elemento, e é o CSS (com a regra `.add-produto.active { bottom: 0; }` mais a `transition`) que cuida de deslizar o formulário pra dentro da tela suavemente. Foi um clique que resolveu bastante coisa depois: separar "o que o JS controla" (classes) do "o que o CSS controla" (aparência/animação a partir dessas classes).

## Demonstração

https://diogowpc.github.io/controle-estoque/
