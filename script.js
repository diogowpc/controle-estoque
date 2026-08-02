let categoriaAtual = "";
let iconeAtual = "";

let editando = false;
let indiceEditando = -1;
let categoriaEditando = "";

const estoque = {

    Hortifruti: [
        {
            nome: "Banana",
            quantidade: 20,
            validade: "2026-08-10"
        },
        {
            nome: "Maçã",
            quantidade: 15,
            validade: "2026-07-20"
        }
    ],

    Açougue: [
        {
            nome: "Carne bovina",
            quantidade: 10,
            validade: "2026-08-05"
        }
    ],

    Padaria: [
        {
            nome: "Pão francês",
            quantidade: 50,
            validade: "2026-08-01"
        }
    ],

    Bebidas: [],

    Doces: []

};

const backdrop = document.querySelector(".back-backdrop");

const wrapper = document.querySelector(".wrapper");

const menu_btn = document.querySelector(".menu_btn");
const back_btn = document.querySelector(".back_btn");

const categorias = document.querySelectorAll(".categoria");

const titulo = document.querySelector("#categoria-titulo");
const produtos = document.querySelector(".produtos");
const quantidade = document.querySelector("#num-produtos");

const addBtn = document.querySelector(".add-produto-btn");
const addProduto = document.querySelector(".add-produto");
const salvarBtn = document.querySelector("#salvar-produto");

const nomeInput = document.querySelector("#produto-input");
const quantidadeInput = document.querySelector("#quantidade-input");
const validadeInput = document.querySelector("#validade-input");

const categoriaInput = document.querySelector("#categoria-input");


addBtn.addEventListener("click", () => {
    addProduto.classList.toggle("active");
    addBtn.classList.toggle("active");
    backdrop.classList.toggle("active");
});

backdrop.addEventListener("click", () => {
    addProduto.classList.remove("active");
    addBtn.classList.remove("active");
    backdrop.classList.remove("active");

    editando = false;
    indiceEditando = -1;
    categoriaEditando ="";
});

// funcao de validade
function verificarValidade(data){

    const hoje = new Date();
    const vencimento = new Date(data);


    // tira as horas para comparar somente dias
    hoje.setHours(0,0,0,0);
    vencimento.setHours(0,0,0,0);


    const diferenca = vencimento - hoje;

    const dias = Math.ceil(
        diferenca / (1000 * 60 * 60 * 24)
    );


    if(dias < 0){

        return {
            texto: "Fora da validade",
            classe: "vencido"
        };

    }


    if(dias <= 7){

        return {
            texto: `${dias} dias para vencer`,
            classe: "proximo"
        };

    }


    return {
        texto: "Dentro da validade",
        classe: "valido"
    };

}

// funcao pra abrir a categoria
function abrirCategoria(nome, icone){

    categoriaAtual = nome;
    iconeAtual = icone;
    wrapper.classList.add("show-categoria");

    titulo.textContent = nome;

    // muda o ícone da categoria
    document.querySelector("#categoria-icon").src = icone;

    produtos.innerHTML = "";

    let lista = estoque[nome] || [];

    quantidade.textContent = `${lista.length} produtos`;

    lista.forEach((produto, index) => {
        const status = verificarValidade(produto.validade);
        const item = document.createElement("div");

        item.classList.add("produto-item");

        item.innerHTML = `
            <div class="produto-info">

                <h2>${produto.nome}</h2>

                <p>
                    Em estoque: ${produto.quantidade}
                    •
                    Val: ${formatarData(produto.validade)}
                </p>

                <span class="status ${status.classe}">
                    ${status.texto}
                </span>

            </div>

            <div class="produto-actions">

                <button class="editar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                </button>

                <button class="excluir">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>

            </div>

        `;

        produtos.appendChild(item);

        const btnExcluir = item.querySelector(".excluir");

        btnExcluir.addEventListener("click", () => {

            estoque[nome].splice(index, 1);

            salvarEstoque();
            atualizarContadores();

            abrirCategoria(nome, icone);

        });
        const btnEditar = item.querySelector(".editar");

        btnEditar.addEventListener("click", () => {

            editando = true;
            indiceEditando = index;
            categoriaEditando = nome;

            nomeInput.value = produto.nome;
            quantidadeInput.value = produto.quantidade;
            validadeInput.value = produto.validade;
            categoriaInput.value = nome;

            addProduto.classList.add("active");
            addBtn.classList.add("active");
            backdrop.classList.add("active");

        });
    });

}

// clicar em uma categoria
categorias.forEach(categoria => {

    categoria.addEventListener("click", () => {

        const nome = categoria.dataset.categoria;
        const icone = categoria.dataset.icon;

        abrirCategoria(nome, icone);

    });

});


// abrir menu
menu_btn.addEventListener("click", () => {
    wrapper.classList.add("show-categoria");
});


// voltar
back_btn.addEventListener("click", () => {
    wrapper.classList.remove("show-categoria");
});

// salvar no local storage
function salvarEstoque(){

    localStorage.setItem(
        "estoque",
        JSON.stringify(estoque)
    );

}

// carregar o local storage
function carregarEstoque(){

    const dados = localStorage.getItem("estoque");


    if(dados){

        Object.assign(
            estoque,
            JSON.parse(dados)
        );

    }

}

function formatarData(data){
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function atualizarContadores(){

    let total = 0;

    categorias.forEach(categoria => {

        const nome = categoria.dataset.categoria;
        const lista = estoque[nome] || [];

        categoria.querySelector(".content p").textContent = `${lista.length} produtos`;

        total += lista.length;

    });

    document.querySelector(".welcome .content p").textContent = `${total} produtos no total`;

}


salvarBtn.addEventListener("click", () => {

    const nome = nomeInput.value;
    const quantidade = quantidadeInput.value;
    const validade = validadeInput.value;


    if(!nome || !quantidade || !validade){

        alert("Preencha todos os campos");

        return;

    }


    const novoProduto = {

        nome: nome,
        quantidade: Number(quantidade),
        validade: validade

    };


    const categoria = categoriaInput.value;

    if (!estoque[categoria]) {
        estoque[categoria] = [];
    }

    const categoriaAntiga = categoriaEditando;

    if(editando){

        estoque[categoriaEditando].splice(indiceEditando, 1);
        estoque[categoria].push(novoProduto);

        editando = false;
        indiceEditando = -1;
        categoriaEditando = "";

    } else {

        estoque[categoria].push(novoProduto);

    }


    salvarEstoque();
    atualizarContadores();


    addProduto.classList.remove("active");
    addBtn.classList.remove("active");
    backdrop.classList.remove("active");


    nomeInput.value = "";
    quantidadeInput.value = "";
    validadeInput.value = "";


    if (categoria === categoriaAtual || categoriaAntiga === categoriaAtual) {
    abrirCategoria(categoriaAtual, iconeAtual);
    }


});

carregarEstoque();
atualizarContadores();