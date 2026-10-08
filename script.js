const botaoMenu = document.querySelector(".botao-menu");

const fecharMenu = document.querySelector(".fechar-menu");

const menuLateral = document.querySelector(".menu-lateral");

const novaTarefa = document.querySelector(".nova-tarefa");

const areaFormulario = document.querySelector(".area-formulario");

const listaTarefas = document.querySelector(".lista-Tarefas");

const detalhesTarefa = document.querySelector(".detalhes-tarefa");

const mensagemInicial = document.querySelector(".mensagem-inicial");

const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

const tarefasConcluidas =
    JSON.parse(localStorage.getItem("tarefasConcluidas")) || [];

const botaoConcluidas =
    document.querySelector(".botao-concluidas");

const tituloLista =
    document.querySelector(".titulo-lista");

let modoLista = "tarefas";


// ==============================
// BOTÃO FILTRAR / ORDENAR
// ==============================

const botaoOrdenar = document.createElement("button");

botaoOrdenar.classList.add("botao-ordenar");

botaoOrdenar.textContent = "☷ Filtrar / ordenar";

novaTarefa.insertAdjacentElement(
    "afterend",
    botaoOrdenar
);


// ==============================
// PAINEL DE FILTRO
// ==============================

const painelOrdenar = document.createElement("div");

painelOrdenar.classList.add("painel-ordenar");

document
    .querySelector(".conteudo")
    .appendChild(painelOrdenar);


// ==============================
// MIGRAÇÃO DOS PASSOS ANTIGOS
// ==============================

tarefas.forEach(function(tarefa) {

    if (typeof tarefa.passos === "string") {

        tarefa.passos = tarefa.passos
            .split("\n")
            .map(function(passo) {

                return {
                    texto: passo.trim(),
                    concluido: false
                };

            })
            .filter(function(passo) {

                return passo.texto !== "";

            });

    }

});

localStorage.setItem(
    "tarefas",
    JSON.stringify(tarefas)
);


// ==============================
// MENU
// ==============================

botaoMenu.addEventListener("click", function() {

    menuLateral.classList.add("aberto");

    mensagemInicial.classList.add("escondido");

});


fecharMenu.addEventListener("click", function() {

    menuLateral.classList.remove("aberto");

    areaFormulario.classList.remove("aberto");

    detalhesTarefa.classList.remove("aberto");

    painelOrdenar.classList.remove("aberto");

    detalhesTarefa.innerHTML = "";

    mensagemInicial.classList.remove("escondido");

});


// ==============================
// ABRIR DETALHES DA TAREFA
// ==============================

function abrirDetalhes(tarefa) {
    mensagemInicial.classList.add("escondido");

    detalhesTarefa.classList.add("aberto");


    const totalPassos = tarefa.passos.length;

    const passosConcluidos =
        tarefa.passos.filter(function(passo) {

            return passo.concluido;

        }).length;


    const porcentagem =
        totalPassos === 0
            ? 0
            : Math.round(
                (passosConcluidos / totalPassos) * 100
            );


    const tarefaConcluida =
        porcentagem === 100;


    const jaFoiConcluida =
        tarefasConcluidas.includes(tarefa);


    detalhesTarefa.innerHTML = `

       <div class="detalhes-conteudo">

    <div class="cabecalho-detalhes">
    <h2>${tarefa.titulo}</h2>
    <span class="porcentagem">${porcentagem}%</span>
</div>


            <p>
                <strong>Categoria:</strong><br>
                ${tarefa.categoria}
            </p>


            <p>
                <strong>Descrição:</strong><br>
                ${tarefa.descricao}
            </p>


            <p>
                <strong>Prioridade:</strong>
                ${tarefa.prioridade}
            </p>


            <p>
                <strong>Prazo:</strong>
                ${tarefa.prazo}
            </p>


            <h3>Passo a passo</h3>


            <div class="lista-passos">

                ${
                    tarefa.passos.length === 0

                    ? `
                        <p>
                            Nenhum passo cadastrado.
                        </p>
                    `

                    : tarefa.passos
                        .map(function(passo, indice) {

                            return `

                                <label class="passo">

                                    <input
                                        type="checkbox"
                                        data-indice="${indice}"
                                        ${
                                            passo.concluido
                                                ? "checked"
                                                : ""
                                        }
                                    >

                                    <span>
                                        ${passo.texto}
                                    </span>

                                </label>

                            `;

                        })
                        .join("")
                }

            </div>


            ${
                !jaFoiConcluida

                ? `

                    <button
                        class="botao-concluir ${
                            tarefaConcluida
                                ? "liberado"
                                : ""
                        }"
                        ${tarefaConcluida
                            ? ""
                            : "disabled"}
                    >

                        ✓ Concluir tarefa

                    </button>

                `

                : ""
            }

        </div>

    `;


    // CHECKBOX DOS PASSOS

    const checkboxes =
        detalhesTarefa.querySelectorAll(
            ".passo input"
        );


    checkboxes.forEach(function(checkbox) {

        checkbox.addEventListener(
            "change",
            function() {

                const indice =
                    Number(
                        checkbox.dataset.indice
                    );


                tarefa.passos[indice].concluido =
                    checkbox.checked;


                // Se a tarefa estiver entre as concluídas,
                // atualiza a cópia dela também.

                if (jaFoiConcluida) {

                    const indiceConcluida =
                        tarefasConcluidas.indexOf(tarefa);

                    if (indiceConcluida !== -1) {

                        tarefasConcluidas[indiceConcluida] =
                            tarefa;

                    }

                    localStorage.setItem(
                        "tarefasConcluidas",
                        JSON.stringify(tarefasConcluidas)
                    );

                } else {

                    localStorage.setItem(
                        "tarefas",
                        JSON.stringify(tarefas)
                    );

                }


                abrirDetalhes(tarefa);

            }
        );

    });


    // BOTÃO CONCLUIR

    const botaoConcluir =
        detalhesTarefa.querySelector(
            ".botao-concluir"
        );


    if (
        tarefaConcluida &&
        !jaFoiConcluida &&
        botaoConcluir
    ) {

        botaoConcluir.addEventListener(
            "click",
            function() {

                const indice =
                    tarefas.indexOf(tarefa);


                if (indice !== -1) {

                    tarefas.splice(indice, 1);

                }


                tarefasConcluidas.push(tarefa);


                localStorage.setItem(
                    "tarefas",
                    JSON.stringify(tarefas)
                );


                localStorage.setItem(
                    "tarefasConcluidas",
                    JSON.stringify(tarefasConcluidas)
                );


                const cards =
                    document.querySelectorAll(
                        ".card-Tarefa"
                    );


                cards.forEach(function(card) {

                    const titulo =
                        card.querySelector("h3");

                    if (
                        titulo &&
                        titulo.textContent === tarefa.titulo
                    ) {

                        card.remove();

                    }

                });


                detalhesTarefa.classList.remove(
                    "aberto"
                );

                detalhesTarefa.innerHTML = "";

                atualizarPainelOrdenar();

            }
        );

    }

}


// ==============================
// ADICIONAR CARD
// ==============================

function adicionarCard(tarefa) {

    const card =
        document.createElement("div");


    card.classList.add("card-Tarefa");


    card.innerHTML = `

        <h3>${tarefa.titulo}</h3>

        <p>${tarefa.categoria}</p>

        <p>${tarefa.descricao}</p>

        <p>
            Prioridade: ${tarefa.prioridade}
        </p>

        <p>
            Prazo: ${tarefa.prazo}
        </p>

        <button class="excluir">
            X
        </button>

    `;


card.addEventListener("click", function() {
    if (
        detalhesTarefa.classList.contains("aberto") &&
        detalhesTarefa.dataset.tarefaId === String(tarefa.id)
    ) {
        detalhesTarefa.classList.remove("aberto");
        detalhesTarefa.innerHTML = "";
        detalhesTarefa.dataset.tarefaId = "";
        return;
    }

    abrirDetalhes(tarefa);
    detalhesTarefa.dataset.tarefaId = String(tarefa.id);
});


    const botaoExcluir =
        card.querySelector(".excluir");


    botaoExcluir.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            card.remove();


            const indice =
                tarefas.indexOf(tarefa);


            if (indice !== -1) {

                tarefas.splice(indice, 1);

            }


            localStorage.setItem(
                "tarefas",
                JSON.stringify(tarefas)
            );


            detalhesTarefa.classList.remove(
                "aberto"
            );

            detalhesTarefa.innerHTML = "";


            atualizarPainelOrdenar();

        }
    );


    listaTarefas.appendChild(card);

}


// ==============================
// CARREGAR TAREFAS
// ==============================

tarefas.forEach(function(tarefa) {

    adicionarCard(tarefa);

});


// ==============================
// NOVA TAREFA
// ==============================

novaTarefa.addEventListener(
    "click",
    function() {

        mostrarTarefas();


        areaFormulario.innerHTML = `

            <form class="formulario-tarefa">

                <h3>Nova tarefa</h3>


                <label for="titulo">
                    Título
                </label>

                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    placeholder="Título da tarefa"
                    required
                >


                <label for="categoria">
                    categoria
                </label>

                <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    placeholder="categoria da tarefa"
                    required
                >


                <label for="descricao">
                    Descrição
                </label>

                <textarea
                    id="descricao"
                    name="descricao"
                    placeholder="Descrição da tarefa"
                    required
                ></textarea>


                <label for="passos">
                    Passo a passo
                </label>

                <textarea
                    id="passos"
                    name="passos"
                    placeholder="Digite um passo por linha"
                ></textarea>


                <label for="prazo">
                    Prazo
                </label>

                <input
                    type="date"
                    id="prazo"
                    name="prazo"
                    required
                >


                <label for="prioridade">
                    Prioridade
                </label>

                <select
                    id="prioridade"
                    name="prioridade"
                    required
                >

                    <option value="">
                        Selecione
                    </option>

                    <option value="baixa">
                        Baixa
                    </option>

                    <option value="media">
                        Média
                    </option>

                    <option value="alta">
                        Alta
                    </option>

                </select>


                <button
                    type="submit"
                    class="criar-tarefa"
                >

                    ✓ Criar tarefa

                </button>


                <button
                    type="button"
                    id="cancelar-tarefa"
                >

                    Cancelar

                </button>

            </form>

        `;


        areaFormulario.classList.add(
            "aberto"
        );


        const formulario =
            document.querySelector(
                ".formulario-tarefa"
            );


        formulario.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const titulo =
                    formulario.querySelector(
                        "#titulo"
                    ).value;


                const categoria =
                    formulario.querySelector(
                        "#categoria"
                    ).value;


                const descricao =
                    formulario.querySelector(
                        "#descricao"
                    ).value;


                const passosTexto =
                    formulario.querySelector(
                        "#passos"
                    ).value;


                const passos =
                    passosTexto
                        .split("\n")
                        .map(function(passo) {

                            return {

                                texto:
                                    passo.trim(),

                                concluido:
                                    false

                            };

                        })
                        .filter(function(passo) {

                            return passo.texto !== "";

                        });


                const prazo =
                    formulario.querySelector(
                        "#prazo"
                    ).value;


                const prioridade =
                    formulario.querySelector(
                        "#prioridade"
                    ).value;


                const tarefa = {

                    titulo: titulo,

                    categoria: categoria,

                    descricao: descricao,

                    passos: passos,

                    prazo: prazo,

                    prioridade: prioridade

                };


                tarefas.push(tarefa);


                localStorage.setItem(
                    "tarefas",
                    JSON.stringify(tarefas)
                );


                if (modoLista === "tarefas") {

                    adicionarCard(tarefa);

                }


                atualizarPainelOrdenar();


                formulario.reset();


                areaFormulario.classList.remove(
                    "aberto"
                );

            }
        );


        document
            .querySelector("#cancelar-tarefa")
            .addEventListener(
                "click",
                function() {

                    areaFormulario.classList.remove(
                        "aberto"
                    );

                }
            );

    }
);


// ==============================
// MOSTRAR TAREFAS
// ==============================

function mostrarTarefas() {

    modoLista = "tarefas";


    listaTarefas.innerHTML = "";


    tituloLista.textContent = "";


    novaTarefa.style.display = "block";


    // O filtro continua visível.

    botaoOrdenar.style.display = "block";


    botaoConcluidas.textContent =
        "✓ Tarefas concluídas";


    painelOrdenar.classList.remove(
        "aberto"
    );


    tarefas.forEach(function(tarefa) {

        adicionarCard(tarefa);

    });

}


// ==============================
// MOSTRAR TAREFAS CONCLUÍDAS
// ==============================

function mostrarTarefasConcluidas() {

    modoLista = "concluidas";


    listaTarefas.innerHTML = "";


    tituloLista.textContent =
        "Tarefas concluídas";


    novaTarefa.style.display = "none";


    // AGORA O FILTRO CONTINUA APARECENDO

    botaoOrdenar.style.display = "block";


    botaoConcluidas.textContent =
        "← Tarefas pendentes";


    painelOrdenar.classList.remove(
        "aberto"
    );


    if (tarefasConcluidas.length === 0) {

        const mensagem =
            document.createElement("p");


        mensagem.textContent =
            "Nenhuma tarefa concluída ainda.";


        mensagem.style.color =
            "#777c70";


        mensagem.style.fontSize =
            "14px";


        listaTarefas.appendChild(
            mensagem
        );


        return;

    }


    tarefasConcluidas.forEach(
        function(tarefa) {

            const card =
                document.createElement("div");


            card.classList.add(
                "card-Tarefa"
            );


            card.innerHTML = `

                <h3>
                    ✓ ${tarefa.titulo}
                </h3>

                <p>
                    ${tarefa.categoria}
                </p>

                <p>
                    ${tarefa.descricao}
                </p>

                <p>
                    Prioridade:
                    ${tarefa.prioridade}
                </p>

                <p>
                    Prazo:
                    ${tarefa.prazo}
                </p>

                <button class="excluir">
                    X
                </button>

            `;


           card.addEventListener("click", function() {
    if (
        detalhesTarefa.classList.contains("aberto") &&
        detalhesTarefa.dataset.tarefaId === String(tarefa.id)
    ) {
        detalhesTarefa.classList.remove("aberto");
        detalhesTarefa.innerHTML = "";
        detalhesTarefa.dataset.tarefaId = "";
        return;
    }

    abrirDetalhes(tarefa);
    detalhesTarefa.dataset.tarefaId = String(tarefa.id);
});


            const botaoExcluir =
                card.querySelector(
                    ".excluir"
                );


            botaoExcluir.addEventListener(
                "click",
                function(event) {

                    event.stopPropagation();


                    const indice =
                        tarefasConcluidas.indexOf(
                            tarefa
                        );


                    if (indice !== -1) {

                        tarefasConcluidas.splice(
                            indice,
                            1
                        );

                    }


                    localStorage.setItem(
                        "tarefasConcluidas",
                        JSON.stringify(
                            tarefasConcluidas
                        )
                    );


                    card.remove();


                    detalhesTarefa.classList.remove(
                        "aberto"
                    );

                    detalhesTarefa.innerHTML = "";


                    atualizarPainelOrdenar();

                }
            );


            listaTarefas.appendChild(card);

        }
    );

}


// ==============================
// BOTÃO TAREFAS CONCLUÍDAS
// ==============================

botaoConcluidas.addEventListener(
    "click",
    function() {

        if (modoLista === "tarefas") {

            mostrarTarefasConcluidas();

        } else {

            mostrarTarefas();

        }

    }
);


// ==============================
// MODO ESCURO
// ==============================

const modoescuro =
    document.querySelector(
        ".botao-modo-escuro"
    );


modoescuro.addEventListener(
    "click",
    function() {

        document.body.classList.toggle(
            "modo-escuro"
        );

    }
);


// ==============================
// PAINEL DE FILTRO / ORDENAÇÃO
// ==============================

function atualizarPainelOrdenar() {

    painelOrdenar.innerHTML = "";

    // CABEÇALHO DO PAINEL

const tituloPainel = document.createElement("div");
tituloPainel.classList.add("titulo-painel");
tituloPainel.textContent = "Filtrar / ordenar";

painelOrdenar.appendChild(tituloPainel);


    // ==========================
    // ORDENAR
    // ==========================

    const tituloOrdenar =
        document.createElement("div");


    tituloOrdenar.classList.add(
        "titulo-filtro"
    );


    tituloOrdenar.textContent =
        "Ordenar";


    painelOrdenar.appendChild(
        tituloOrdenar
    );


    const opcoes = [

        {
            texto: "Prazo",
            valor: "prazo"
        },

        {
            texto: "Prioridade",
            valor: "prioridade"
        },

        {
            texto: "Prioridade + Prazo",
            valor: "prioridade-prazo"
        }

    ];


    opcoes.forEach(function(opcao) {

        const botao =
            document.createElement("button");


        botao.textContent =
            opcao.texto;


       botao.addEventListener(
    "click",
    function() {

        ordenarTarefas(
            opcao.valor
        );

    }
);


        painelOrdenar.appendChild(
            botao
        );

    });


    // ==========================
    // CATEGORIAS
    // ==========================

    const tarefasAtuais =
        modoLista === "concluidas"
            ? tarefasConcluidas
            : tarefas;


    const categorias =
        [
            ...new Set(

                tarefasAtuais

                    .map(function(tarefa) {

                        return tarefa.categoria.trim();

                    })

                    .filter(function(categoria) {

                        return categoria !== "";

                    })

            )
        ];


    if (categorias.length > 0) {

        const tituloCategorias =
            document.createElement("div");


        tituloCategorias.classList.add(
            "titulo-filtro"
        );


        tituloCategorias.textContent =
            "Categorias";


        painelOrdenar.appendChild(
            tituloCategorias
        );


        categorias.sort(function(a, b) {

            return a.localeCompare(b);

        });


        categorias.forEach(
            function(categoria) {

                const quantidade =
                    tarefasAtuais.filter(
                        function(tarefa) {

                            return (
                                tarefa.categoria.trim() ===
                                categoria
                            );

                        }
                    ).length;


                const botao =
                    document.createElement(
                        "button"
                    );


                botao.classList.add(
                    "botao-categoria"
                );


                botao.innerHTML = `

                    <span>
                        ${categoria}
                    </span>

                    <span class="quantidade-filtro">
                        ${quantidade}
                    </span>

                `;


                botao.addEventListener(
                    "click",
                    function() {

                        ordenarTarefas(
                            categoria
                        );


                        painelOrdenar.classList.remove(
                            "aberto"
                        );

                    }
                );


                painelOrdenar.appendChild(
                    botao
                );

            }
        );

    }


    // ==========================
    // DIVISÓRIA
    // ==========================

    const divisoria =
        document.createElement("div");


    divisoria.classList.add(
        "divisoria-filtro"
    );


    painelOrdenar.appendChild(
        divisoria
    );


    // ==========================
    // RESUMO
    // ==========================

    const tituloResumo =
        document.createElement("div");


    tituloResumo.classList.add(
        "titulo-filtro"
    );


    tituloResumo.textContent =
        "Resumo";


    painelOrdenar.appendChild(
        tituloResumo
    );


    const resumo =
        document.createElement("div");


    resumo.classList.add(
        "resumo-filtro"
    );


    const pendentes =
        tarefas.length;


    const concluidas =
        tarefasConcluidas.length;


    const total =
        pendentes + concluidas;


    resumo.innerHTML = `

        <div class="linha-resumo">

            <span>Pendentes</span>

            <strong>
                ${pendentes}
            </strong>

        </div>


        <div class="linha-resumo">

            <span>Concluídas</span>

            <strong>
                ${concluidas}
            </strong>

        </div>


        <div class="linha-resumo">

            <span>Total</span>

            <strong>
                ${total}
            </strong>

        </div>

    `;


    painelOrdenar.appendChild(
        resumo
    );

}


// ==============================
// ORDENAR / FILTRAR
// ==============================

function ordenarTarefas(tipo) {

    const tarefasBase =
        modoLista === "concluidas"
            ? tarefasConcluidas
            : tarefas;


    const tarefasOrdenadas =
        [...tarefasBase];


    // ==========================
    // PRAZO
    // ==========================

    if (tipo === "prazo") {

        tarefasOrdenadas.sort(
            function(a, b) {

                return (
                    new Date(a.prazo) -
                    new Date(b.prazo)
                );

            }
        );

    }


    // ==========================
    // PRIORIDADE
    // ==========================

    else if (tipo === "prioridade") {

        const ordemPrioridade = {

            alta: 1,

            media: 2,

            baixa: 3

        };


        tarefasOrdenadas.sort(
            function(a, b) {

                return (
                    ordemPrioridade[a.prioridade] -
                    ordemPrioridade[b.prioridade]
                );

            }
        );

    }


    // ==========================
    // PRIORIDADE + PRAZO
    // ==========================

    else if (tipo === "prioridade-prazo") {

        const ordemPrioridade = {

            alta: 1,

            media: 2,

            baixa: 3

        };


        tarefasOrdenadas.sort(
            function(a, b) {

                const prioridade =
                    ordemPrioridade[a.prioridade] -
                    ordemPrioridade[b.prioridade];


                if (prioridade !== 0) {

                    return prioridade;

                }


                return (
                    new Date(a.prazo) -
                    new Date(b.prazo)
                );

            }
        );

    }


    // ==========================
    // CATEGORIA
    // ==========================

    else {

        const tarefasDaCategoria =
            tarefasOrdenadas.filter(
                function(tarefa) {

                    return (
                        tarefa.categoria.trim() ===
                        tipo
                    );

                }
            );


        listaTarefas.innerHTML = "";


        tarefasDaCategoria.forEach(
            function(tarefa) {

                if (modoLista === "tarefas") {

                    adicionarCard(tarefa);

                } else {

                    adicionarCardConcluida(tarefa);

                }

            }
        );


        atualizarResumoCategoria(tipo);

        return;

    }


    listaTarefas.innerHTML = "";


    tarefasOrdenadas.forEach(
        function(tarefa) {

            if (modoLista === "tarefas") {

                adicionarCard(tarefa);

            } else {

                adicionarCardConcluida(tarefa);

            }

        }
    );

}


// ==============================
// CARD DE TAREFA CONCLUÍDA
// ==============================

function adicionarCardConcluida(tarefa) {

    const card =
        document.createElement("div");


    card.classList.add(
        "card-Tarefa"
    );


    card.innerHTML = `

        <h3>
            ✓ ${tarefa.titulo}
        </h3>

        <p>
            ${tarefa.categoria}
        </p>

        <p>
            ${tarefa.descricao}
        </p>

        <p>
            Prioridade:
            ${tarefa.prioridade}
        </p>

        <p>
            Prazo:
            ${tarefa.prazo}
        </p>

        <button class="excluir">
            X
        </button>

    `;


    card.addEventListener(
        "click",
        function() {

            abrirDetalhes(tarefa);

        }
    );


    const botaoExcluir =
        card.querySelector(
            ".excluir"
        );


    botaoExcluir.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            const indice =
                tarefasConcluidas.indexOf(
                    tarefa
                );


            if (indice !== -1) {

                tarefasConcluidas.splice(
                    indice,
                    1
                );

            }


            localStorage.setItem(
                "tarefasConcluidas",
                JSON.stringify(
                    tarefasConcluidas
                )
            );


            card.remove();


            detalhesTarefa.classList.remove(
                "aberto"
            );

            detalhesTarefa.innerHTML = "";


            atualizarPainelOrdenar();

        }
    );


    listaTarefas.appendChild(
        card
    );

}


// ==============================
// RESUMO DA CATEGORIA
// ==============================

function atualizarResumoCategoria(categoria) {

    const quantidadePendentes =
        tarefas.filter(
            function(tarefa) {

                return (
                    tarefa.categoria.trim() ===
                    categoria
                );

            }
        ).length;


    const quantidadeConcluidas =
        tarefasConcluidas.filter(
            function(tarefa) {

                return (
                    tarefa.categoria.trim() ===
                    categoria
                );

            }
        ).length;


    const quantidadeTotal =
        quantidadePendentes +
        quantidadeConcluidas;


    const resumo =
        painelOrdenar.querySelector(
            ".resumo-filtro"
        );


    if (!resumo) {
        return;
    }


    resumo.innerHTML = `

        <div class="categoria-selecionada">

            ${categoria}

        </div>


        <div class="linha-resumo">

            <span>Pendentes</span>

            <strong>
                ${quantidadePendentes}
            </strong>

        </div>


        <div class="linha-resumo">

            <span>Concluídas</span>

            <strong>
                ${quantidadeConcluidas}
            </strong>

        </div>


        <div class="linha-resumo">

            <span>Total</span>

            <strong>
                ${quantidadeTotal}
            </strong>

        </div>

    `;

}


// ==============================
// ABRIR / FECHAR PAINEL
// ==============================

botaoOrdenar.addEventListener(
    "click",
    function() {

        atualizarPainelOrdenar();

        painelOrdenar.classList.toggle(
            "aberto"
        );

    }
);