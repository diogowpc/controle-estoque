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
    ]

};

const wrapper = document.querySelector(".wrapper");

const menu_btn = document.querySelector(".menu_btn");
const back_btn = document.querySelector(".back_btn");

const categorias = document.querySelectorAll(".categoria");

const titulo = document.querySelector("#categoria-titulo");
const produtos = document.querySelector(".produtos");
const quantidade = document.querySelector("#num-produtos");


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

    wrapper.classList.add("show-categoria");


    titulo.textContent = nome;


    // muda o ícone
    document.querySelector("#categoria-icon").src = icone;


    produtos.innerHTML = "";


    let lista = estoque[nome] || [];


    quantidade.textContent = `${lista.length} produtos`;



   lista.forEach(produto => {


    const status = verificarValidade(produto.validade);



    const item = document.createElement("div");

    item.classList.add("produto-item");


    item.innerHTML = `

        <div class="produto-info">


            <h2>${produto.nome}</h2>


            <p>
                Em estoque: ${produto.quantidade}
                •
                Validade: ${produto.validade}
            </p>


            <span class="status ${status.classe}">
                ${status.texto}
            </span>


        </div>

    `;


    produtos.appendChild(item);

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