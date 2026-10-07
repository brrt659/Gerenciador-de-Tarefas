
const botaoMenu = document.querySelector(".botao-menu");

const fecharMenu = document.querySelector(".fechar-menu");

const menuLateral = document.querySelector(".menu-lateral");

const novaTarefa = document.querySelector(".nova-tarefa");

const areaFormulario = document.querySelector(".area-formulario");

const listaTarefas = document.querySelector(".lista-Tarefas");

const detalhesTarefa = document.querySelector(".detalhes-tarefa");

const mensagemInicial = document.querySelector(".mensagem-inicial");

const tarefas =
    JSON.parse(localStorage.getItem("tarefas")) || [];

const tarefasConcluidas =
    JSON.parse(localStorage.getItem("tarefasConcluidas")) || [];

const botaoConcluidas =
    document.querySelector(".botao-concluidas");

const tituloLista =
    document.querySelector(".titulo-lista");

let modoLista = "tarefas";


// ==========================================
// CORRIGIR TAREFAS ANTIGAS
// ==========================================

tarefas.forEach(function(tarefa) {

    if (!Array.isArray(tarefa.passos)) {

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

        } else {

            tarefa.passos = [];

        }

    }

});

localStorage.setItem(
    "tarefas",
    JSON.stringify(tarefas)
);


// ==========================================
// ABRIR MENU
// ==========================================

botaoMenu.addEventListener("click", function() {

    menuLateral.classList.add("aberto");

    mensagemInicial.classList.add("escondido");

});


// ==========================================
// FECHAR MENU
// ==========================================

fecharMenu.addEventListener("click", function() {

    menuLateral.classList.remove("aberto");

    areaFormulario.classList.remove("aberto");

    detalhesTarefa.classList.remove("aberto");

    detalhesTarefa.innerHTML = "";

    mensagemInicial.classList.remove("escondido");

});


// ==========================================
// ABRIR DETALHES
// ==========================================

function abrirDetalhes(tarefa) {

    mensagemInicial.classList.add("escondido");

    detalhesTarefa.classList.add("aberto");


    const totalPassos =
        tarefa.passos.length;


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


    detalhesTarefa.innerHTML = `

        <div class="detalhes-conteudo">

            <div class="cabecalho-detalhes">

                <h2>
                    ${tarefa.titulo}
                </h2>

                <span class="porcentagem">
                    ${porcentagem}%
                </span>

            </div>


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


            <h3>
                Passo a passo
            </h3>


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


            <button
                class="botao-concluir ${
                    tarefaConcluida
                    ? "liberado"
                    : ""
                }"
                ${
                    tarefaConcluida
                    ? ""
                    : "disabled"
                }
            >

                ✓ Concluir tarefa

            </button>

        </div>

    `;


    // ======================================
    // CHECKBOXES DOS PASSOS
    // ======================================

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


                localStorage.setItem(
                    "tarefas",
                    JSON.stringify(tarefas)
                );


                abrirDetalhes(tarefa);

            }
        );

    });


    // ======================================
    // BOTÃO CONCLUIR TAREFA
    // ======================================

    const botaoConcluir =
        detalhesTarefa.querySelector(
            ".botao-concluir"
        );


    if (
        tarefaConcluida &&
        modoLista === "tarefas"
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
                    JSON.stringify(
                        tarefasConcluidas
                    )
                );


                // Remover card da tela

                const cards =
                    document.querySelectorAll(
                        ".card-Tarefa"
                    );


                cards.forEach(function(card) {

                    const titulo =
                        card.querySelector("h3");


                    if (
                        titulo &&
                        titulo.textContent ===
                        tarefa.titulo
                    ) {

                        card.remove();

                    }

                });


                detalhesTarefa.classList.remove(
                    "aberto"
                );

                detalhesTarefa.innerHTML = "";

            }
        );

    }

}


// ==========================================
// CRIAR CARD DE TAREFA PENDENTE
// ==========================================

function adicionarCard(tarefa) {

    const card =
        document.createElement("div");


    card.classList.add(
        "card-Tarefa"
    );


    card.innerHTML = `

        <h3>
            ${tarefa.titulo}
        </h3>

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


    // Abrir detalhes

    card.addEventListener(
        "click",
        function() {

            abrirDetalhes(tarefa);

        }
    );


    // Excluir tarefa

    const botaoExcluir =
        card.querySelector(".excluir");


    botaoExcluir.addEventListener(
        "click",
        function(event) {

            event.stopPropagation();


            const indice =
                tarefas.indexOf(tarefa);


            if (indice !== -1) {

                tarefas.splice(indice, 1);

            }


            localStorage.setItem(
                "tarefas",
                JSON.stringify(tarefas)
            );


            card.remove();


            detalhesTarefa.classList.remove(
                "aberto"
            );

            detalhesTarefa.innerHTML = "";

        }
    );


    listaTarefas.appendChild(card);

}


// ==========================================
// MOSTRAR TAREFAS PENDENTES
// ==========================================

function mostrarTarefas() {

    modoLista = "tarefas";


    listaTarefas.innerHTML = "";


    tituloLista.textContent = "";


    novaTarefa.style.display = "block";


    botaoConcluidas.textContent =
        "✓ Tarefas concluídas";


    tarefas.forEach(function(tarefa) {

        adicionarCard(tarefa);

    });

}


// ==========================================
// MOSTRAR TAREFAS CONCLUÍDAS
// ==========================================

function mostrarTarefasConcluidas() {

    modoLista = "concluidas";


    listaTarefas.innerHTML = "";


    tituloLista.textContent =
        "Tarefas concluídas";


    novaTarefa.style.display = "none";


    botaoConcluidas.textContent =
        "← Tarefas pendentes";


    if (
        tarefasConcluidas.length === 0
    ) {

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


            // Abrir detalhes

            card.addEventListener(
                "click",
                function() {

                    abrirDetalhes(tarefa);

                }
            );


            // Excluir tarefa concluída

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

                }
            );


            listaTarefas.appendChild(card);

        }
    );

}


// ==========================================
// BOTÃO TAREFAS CONCLUÍDAS / PENDENTES
// ==========================================

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


// ==========================================
// CARREGAR TAREFAS AO ABRIR
// ==========================================

tarefas.forEach(function(tarefa) {

    adicionarCard(tarefa);

});


// ==========================================
// NOVA TAREFA
// ==========================================

novaTarefa.addEventListener(
    "click",
    function() {

        // Garantir que estamos nas pendentes

        mostrarTarefas();


        areaFormulario.innerHTML = `

            <form class="formulario-tarefa">

                <h3>
                    Nova tarefa
                </h3>


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


        // ======================================
        // SALVAR NOVA TAREFA
        // ======================================

        formulario.addEventListener(
            "submit",
            function(event) {

                event.preventDefault();


                const titulo =
                    formulario
                        .querySelector("#titulo")
                        .value;


                const descricao =
                    formulario
                        .querySelector("#descricao")
                        .value;


                const passosTexto =
                    formulario
                        .querySelector("#passos")
                        .value;


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

                            return (
                                passo.texto !== ""
                            );

                        });


                const prazo =
                    formulario
                        .querySelector("#prazo")
                        .value;


                const prioridade =
                    formulario
                        .querySelector("#prioridade")
                        .value;


                const tarefa = {

                    titulo: titulo,

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


                adicionarCard(tarefa);


                formulario.reset();


                areaFormulario.classList.remove(
                    "aberto"
                );

            }
        );


        // ======================================
        // CANCELAR
        // ======================================

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

