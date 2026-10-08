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


// ======================================================
// FILTRO / ORDENAÇÃO
// ======================================================

const botaoOrdenar = document.createElement("button");

botaoOrdenar.classList.add("botao-ordenar");
botaoOrdenar.textContent = "☷ Filtrar / ordenar";

novaTarefa.insertAdjacentElement(
    "afterend",
    botaoOrdenar
);

const painelOrdenar = document.createElement("div");

painelOrdenar.classList.add("painel-ordenar");

document
    .querySelector(".conteudo")
    .appendChild(painelOrdenar);


// ======================================================
// MIGRAÇÃO DOS PASSOS ANTIGOS
// ======================================================

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


// ======================================================
// MENU LATERAL
// ======================================================

botaoMenu.addEventListener(
    "click",
    function() {
        menuLateral.classList.add("aberto");
        mensagemInicial.classList.add("escondido");
    }
);

fecharMenu.addEventListener(
    "click",
    function() {
        menuLateral.classList.remove("aberto");
        areaFormulario.classList.remove("aberto");
        detalhesTarefa.classList.remove("aberto");
        painelOrdenar.classList.remove("aberto");

        detalhesTarefa.innerHTML = "";
        detalhesTarefa._tarefaAtual = null;

        mensagemInicial.classList.remove("escondido");
    }
);


// ======================================================
// ABRIR DETALHES DA TAREFA
// ======================================================

function abrirDetalhes(tarefa) {
    mensagemInicial.classList.add("escondido");
    detalhesTarefa.classList.add("aberto");

    const totalPassos = tarefa.passos.length;

    const passosConcluidos =
        tarefa.passos.filter(function(passo) {
            return passo.concluido;
        }).length;

    let porcentagem = 0;

    if (totalPassos > 0) {
        porcentagem = Math.round(
            (passosConcluidos / totalPassos) * 100
        );
    }

    const tarefaConcluida =
        tarefasConcluidas.includes(tarefa);

    detalhesTarefa.innerHTML = `
        <div class="cabecalho-detalhes">
            <h2>${tarefa.titulo}</h2>
            <span class="porcentagem">${porcentagem}%</span>
        </div>

        <p>
            <strong>Categoria:</strong>
            ${tarefa.categoria || "Sem categoria"}
        </p>

        <p>
            <strong>Descrição:</strong>
            ${tarefa.descricao || "Sem descrição"}
        </p>

        <p>
            <strong>Prioridade:</strong>
            ${tarefa.prioridade}
        </p>

        <p>
            <strong>Prazo:</strong>
            ${tarefa.prazo || "Sem prazo"}
        </p>

        <h3>Passo a passo</h3>

        <div class="passos-detalhes">
            ${
                tarefa.passos.length > 0
                    ? tarefa.passos
                        .map(function(passo, indice) {
                            return `
                                <label class="passo">
                                    <input
                                        type="checkbox"
                                        data-indice="${indice}"
                                        ${passo.concluido ? "checked" : ""}
                                    >
                                    <span>
                                        ${passo.texto}
                                    </span>
                                </label>
                            `;
                        })
                        .join("")
                    : "<p>Nenhum passo cadastrado.</p>"
            }
        </div>

        ${
            !tarefaConcluida
                ? `
                    <button class="concluir-tarefa">
                        ✓ Concluir tarefa
                    </button>
                `
                : ""
        }
    `;

    detalhesTarefa
        .querySelectorAll("input[type='checkbox']")
        .forEach(function(checkbox) {
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

                    localStorage.setItem(
                        "tarefasConcluidas",
                        JSON.stringify(tarefasConcluidas)
                    );

                    abrirDetalhes(tarefa);

                    detalhesTarefa._tarefaAtual = tarefa;
                }
            );
        });

    const botaoConcluir =
        detalhesTarefa.querySelector(
            ".concluir-tarefa"
        );

    if (botaoConcluir) {
        botaoConcluir.addEventListener(
            "click",
            function() {
                const todosConcluidos =
                    tarefa.passos.length === 0 ||
                    tarefa.passos.every(
                        function(passo) {
                            return passo.concluido;
                        }
                    );

                if (!todosConcluidos) {
                    return;
                }

                const indice =
                    tarefas.indexOf(tarefa);

                if (indice !== -1) {
                    tarefas.splice(indice, 1);
                }

                if (
                    !tarefasConcluidas.includes(tarefa)
                ) {
                    tarefasConcluidas.push(tarefa);
                }

                localStorage.setItem(
                    "tarefas",
                    JSON.stringify(tarefas)
                );

                localStorage.setItem(
                    "tarefasConcluidas",
                    JSON.stringify(tarefasConcluidas)
                );

                detalhesTarefa.classList.remove(
                    "aberto"
                );

                detalhesTarefa.innerHTML = "";
                detalhesTarefa._tarefaAtual = null;

                mostrarTarefas();

                atualizarPainelOrdenar();
            }
        );
    }
}


// ======================================================
// CLIQUE DOS CARDS
// ======================================================

function configurarCliqueCard(card, tarefa) {
    card.addEventListener(
        "click",
        function() {

            // Mesmo card aberto → fecha
            if (
                detalhesTarefa.classList.contains(
                    "aberto"
                ) &&
                detalhesTarefa._tarefaAtual === tarefa
            ) {
                detalhesTarefa.classList.remove(
                    "aberto"
                );

                detalhesTarefa.innerHTML = "";
                detalhesTarefa._tarefaAtual = null;

                return;
            }

            // Outro card → troca diretamente
            abrirDetalhes(tarefa);

            detalhesTarefa._tarefaAtual = tarefa;
        }
    );
}


// ======================================================
// ADICIONAR CARD DE TAREFA PENDENTE
// ======================================================

function adicionarCard(tarefa) {
    const card = document.createElement("div");

    card.classList.add("card-Tarefa");

    card.innerHTML = `
        <h3>${tarefa.titulo}</h3>

        <p>
            ${tarefa.categoria || "Sem categoria"}
        </p>

        <p>
            ${tarefa.descricao || "Sem descrição"}
        </p>

        <p>
            Prioridade: ${tarefa.prioridade}
        </p>

        <p>
            Prazo: ${tarefa.prazo || "Sem prazo"}
        </p>

        <button class="excluir">X</button>
    `;

    configurarCliqueCard(card, tarefa);

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
            detalhesTarefa._tarefaAtual = null;

            atualizarPainelOrdenar();
        }
    );

    listaTarefas.appendChild(card);
}


// ======================================================
// ADICIONAR CARD DE TAREFA CONCLUÍDA
// ======================================================

function adicionarCardConcluida(tarefa) {
    const card = document.createElement("div");

    card.classList.add("card-Tarefa");

    card.innerHTML = `
        <h3>✓ ${tarefa.titulo}</h3>

        <p>
            ${tarefa.categoria || "Sem categoria"}
        </p>

        <p>
            ${tarefa.descricao || "Sem descrição"}
        </p>

        <p>
            Prioridade: ${tarefa.prioridade}
        </p>

        <p>
            Prazo: ${tarefa.prazo || "Sem prazo"}
        </p>

        <button class="excluir">X</button>
    `;

    configurarCliqueCard(card, tarefa);

    const botaoExcluir =
        card.querySelector(".excluir");

    botaoExcluir.addEventListener(
        "click",
        function(event) {
            event.stopPropagation();

            const indice =
                tarefasConcluidas.indexOf(tarefa);

            if (indice !== -1) {
                tarefasConcluidas.splice(
                    indice,
                    1
                );
            }

            localStorage.setItem(
                "tarefasConcluidas",
                JSON.stringify(tarefasConcluidas)
            );

            card.remove();

            detalhesTarefa.classList.remove(
                "aberto"
            );

            detalhesTarefa.innerHTML = "";
            detalhesTarefa._tarefaAtual = null;

            atualizarPainelOrdenar();
        }
    );

    listaTarefas.appendChild(card);
}


// ======================================================
// MOSTRAR TAREFAS PENDENTES
// ======================================================

function mostrarTarefas() {
    modoLista = "tarefas";

    listaTarefas.innerHTML = "";

    tituloLista.textContent = "";

    novaTarefa.style.display = "block";

    botaoOrdenar.style.display = "block";

    botaoConcluidas.textContent =
        "✓ Tarefas concluídas";

    painelOrdenar.classList.remove("aberto");

    tarefas.forEach(function(tarefa) {
        adicionarCard(tarefa);
    });
}


// ======================================================
// MOSTRAR TAREFAS CONCLUÍDAS
// ======================================================

function mostrarTarefasConcluidas() {
    modoLista = "concluidas";

    listaTarefas.innerHTML = "";

    tituloLista.textContent =
        "Tarefas concluídas";

    novaTarefa.style.display = "none";

    botaoOrdenar.style.display = "block";

    botaoConcluidas.textContent =
        "← Tarefas pendentes";

    painelOrdenar.classList.remove("aberto");

    if (tarefasConcluidas.length === 0) {
        const mensagem =
            document.createElement("p");

        mensagem.textContent =
            "Nenhuma tarefa concluída ainda.";

        mensagem.style.color = "#777c70";
        mensagem.style.fontSize = "14px";

        listaTarefas.appendChild(mensagem);

        return;
    }

    tarefasConcluidas.forEach(function(tarefa) {
        adicionarCardConcluida(tarefa);
    });
}


// ======================================================
// BOTÃO TAREFAS CONCLUÍDAS
// ======================================================

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


// ======================================================
// NOVA TAREFA
// ======================================================

novaTarefa.addEventListener(
    "click",
    function() {
        mensagemInicial.classList.add(
            "escondido"
        );

        detalhesTarefa.classList.remove(
            "aberto"
        );

        detalhesTarefa.innerHTML = "";
        detalhesTarefa._tarefaAtual = null;

        areaFormulario.classList.add(
            "aberto"
        );

        areaFormulario.innerHTML = `
            <form class="formulario-tarefa">

                <h2>Nova tarefa</h2>

                <label>
                    Título
                    <input
                        type="text"
                        name="titulo"
                        required
                    >
                </label>

                <label>
                    Categoria
                    <input
                        type="text"
                        name="categoria"
                    >
                </label>

                <label>
                    Descrição
                    <textarea
                        name="descricao"
                    ></textarea>
                </label>

                <label>
                    Passo a passo
                    <textarea
                        name="passos"
                        placeholder="Um passo por linha"
                    ></textarea>
                </label>

                <label>
                    Prazo
                    <input
                        type="date"
                        name="prazo"
                    >
                </label>

                <label>
                    Prioridade
                    <select
                        name="prioridade"
                        required
                    >
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
                </label>

                <div class="botoes-formulario">

                    <button
                        type="submit"
                        class="salvar-tarefa"
                    >
                        Salvar
                    </button>

                    <button
                        type="button"
                        class="cancelar-tarefa"
                    >
                        Cancelar
                    </button>

                </div>

            </form>
        `;

        const formulario =
            areaFormulario.querySelector(
                ".formulario-tarefa"
            );

        formulario.addEventListener(
            "submit",
            function(event) {
                event.preventDefault();

                const titulo =
                    formulario
                        .querySelector(
                            "[name='titulo']"
                        )
                        .value
                        .trim();

                const categoria =
                    formulario
                        .querySelector(
                            "[name='categoria']"
                        )
                        .value
                        .trim();

                const descricao =
                    formulario
                        .querySelector(
                            "[name='descricao']"
                        )
                        .value
                        .trim();

                const passosTexto =
                    formulario
                        .querySelector(
                            "[name='passos']"
                        )
                        .value;

                const prazo =
                    formulario
                        .querySelector(
                            "[name='prazo']"
                        )
                        .value;

                const prioridade =
                    formulario
                        .querySelector(
                            "[name='prioridade']"
                        )
                        .value;

                const passos =
                    passosTexto
                        .split("\n")
                        .map(function(passo) {
                            return {
                                texto: passo.trim(),
                                concluido: false
                            };
                        })
                        .filter(function(passo) {
                            return (
                                passo.texto !== ""
                            );
                        });

                const novaTarefaObjeto = {
                    id: Date.now(),
                    titulo: titulo,
                    categoria: categoria,
                    descricao: descricao,
                    passos: passos,
                    prazo: prazo,
                    prioridade: prioridade
                };

                tarefas.push(
                    novaTarefaObjeto
                );

                localStorage.setItem(
                    "tarefas",
                    JSON.stringify(tarefas)
                );

                if (modoLista === "tarefas") {
                    adicionarCard(
                        novaTarefaObjeto
                    );
                }

                atualizarPainelOrdenar();

                formulario.reset();

                areaFormulario.classList.remove(
                    "aberto"
                );

                mensagemInicial.classList.remove(
                    "escondido"
                );
            }
        );

        const botaoCancelar =
            formulario.querySelector(
                ".cancelar-tarefa"
            );

        botaoCancelar.addEventListener(
            "click",
            function() {
                areaFormulario.classList.remove(
                    "aberto"
                );

                areaFormulario.innerHTML = "";

                mensagemInicial.classList.remove(
                    "escondido"
                );
            }
        );
    }
);


// ======================================================
// MODO ESCURO
// ======================================================

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


// ======================================================
// ORDENAÇÃO
// ======================================================

function ordenarTarefas(tipo) {
    const listaAtual =
        modoLista === "tarefas"
            ? tarefas
            : tarefasConcluidas;

    const listaOrdenada =
        [...listaAtual];

    if (tipo === "prazo") {
        listaOrdenada.sort(
            function(a, b) {
                if (!a.prazo) return 1;
                if (!b.prazo) return -1;

                return a.prazo.localeCompare(
                    b.prazo
                );
            }
        );
    }

    if (tipo === "prioridade") {
        const ordem = {
            alta: 1,
            media: 2,
            baixa: 3
        };

        listaOrdenada.sort(
            function(a, b) {
                return (
                    ordem[a.prioridade] -
                    ordem[b.prioridade]
                );
            }
        );
    }

    if (tipo === "prioridade-prazo") {
        const ordem = {
            alta: 1,
            media: 2,
            baixa: 3
        };

        listaOrdenada.sort(
            function(a, b) {
                const prioridadeA =
                    ordem[a.prioridade];

                const prioridadeB =
                    ordem[b.prioridade];

                if (
                    prioridadeA !==
                    prioridadeB
                ) {
                    return (
                        prioridadeA -
                        prioridadeB
                    );
                }

                if (!a.prazo) return 1;
                if (!b.prazo) return -1;

                return a.prazo.localeCompare(
                    b.prazo
                );
            }
        );
    }

    if (
        tipo !== "prazo" &&
        tipo !== "prioridade" &&
        tipo !== "prioridade-prazo"
    ) {
        const listaFiltrada =
            listaAtual.filter(
                function(tarefa) {
                    return (
                        tarefa.categoria &&
                        tarefa.categoria
                            .trim() === tipo
                    );
                }
            );

        listaTarefas.innerHTML = "";

        listaFiltrada.forEach(
            function(tarefa) {
                if (modoLista === "tarefas") {
                    adicionarCard(tarefa);
                } else {
                    adicionarCardConcluida(
                        tarefa
                    );
                }
            }
        );

        atualizarResumoCategoria(tipo);

        return;
    }

    listaTarefas.innerHTML = "";

    listaOrdenada.forEach(
        function(tarefa) {
            if (modoLista === "tarefas") {
                adicionarCard(tarefa);
            } else {
                adicionarCardConcluida(
                    tarefa
                );
            }
        }
    );
}


// ======================================================
// PAINEL DE FILTRO / ORDENAÇÃO
// ======================================================

function atualizarPainelOrdenar() {
    painelOrdenar.innerHTML = "";

    const titulo =
        document.createElement("h3");

    titulo.textContent =
        "Filtrar / ordenar";

    painelOrdenar.appendChild(titulo);


    // ------------------------------
    // ORDENAÇÃO
    // ------------------------------

    const botaoPrazo =
        document.createElement("button");

    botaoPrazo.textContent =
        "Prazo";

    botaoPrazo.addEventListener(
        "click",
        function() {
            ordenarTarefas("prazo");
        }
    );

    painelOrdenar.appendChild(
        botaoPrazo
    );


    const botaoPrioridade =
        document.createElement("button");

    botaoPrioridade.textContent =
        "Prioridade";

    botaoPrioridade.addEventListener(
        "click",
        function() {
            ordenarTarefas(
                "prioridade"
            );
        }
    );

    painelOrdenar.appendChild(
        botaoPrioridade
    );


    const botaoPrioridadePrazo =
        document.createElement("button");

    botaoPrioridadePrazo.textContent =
        "Prioridade + Prazo";

    botaoPrioridadePrazo.addEventListener(
        "click",
        function() {
            ordenarTarefas(
                "prioridade-prazo"
            );
        }
    );

    painelOrdenar.appendChild(
        botaoPrioridadePrazo
    );


    // ------------------------------
    // CATEGORIAS
    // ------------------------------

    const tituloCategorias =
        document.createElement("h3");

    tituloCategorias.textContent =
        "Categorias";

    painelOrdenar.appendChild(
        tituloCategorias
    );

    const listaAtual =
        modoLista === "tarefas"
            ? tarefas
            : tarefasConcluidas;

    const categorias = {};

    listaAtual.forEach(
        function(tarefa) {
            const categoria =
                tarefa.categoria
                    ? tarefa.categoria.trim()
                    : "";

            if (categoria !== "") {
                categorias[categoria] =
                    (categorias[categoria] || 0) + 1;
            }
        }
    );

    Object.keys(categorias)
        .sort()
        .forEach(
            function(categoria) {
                const botaoCategoria =
                    document.createElement(
                        "button"
                    );

                botaoCategoria.textContent =
                    `${categoria} (${categorias[categoria]})`;

                botaoCategoria.addEventListener(
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
                    botaoCategoria
                );
            }
        );


    // ------------------------------
    // RESUMO
    // ------------------------------

    const resumo =
        document.createElement("div");

    resumo.classList.add(
        "resumo-tarefas"
    );

    resumo.innerHTML = `
        <p>
            Pendentes:
            <strong>${tarefas.length}</strong>
        </p>

        <p>
            Concluídas:
            <strong>${tarefasConcluidas.length}</strong>
        </p>

        <p>
            Total:
            <strong>
                ${
                    tarefas.length +
                    tarefasConcluidas.length
                }
            </strong>
        </p>
    `;

    painelOrdenar.appendChild(resumo);
}


// ======================================================
// RESUMO DE CATEGORIA
// ======================================================

function atualizarResumoCategoria(
    categoria
) {
    const listaAtual =
        modoLista === "tarefas"
            ? tarefas
            : tarefasConcluidas;

    const quantidade =
        listaAtual.filter(
            function(tarefa) {
                return (
                    tarefa.categoria &&
                    tarefa.categoria.trim() ===
                        categoria
                );
            }
        ).length;

    const resumoAnterior =
        painelOrdenar.querySelector(
            ".resumo-categoria"
        );

    if (resumoAnterior) {
        resumoAnterior.remove();
    }

    const resumo =
        document.createElement("p");

    resumo.classList.add(
        "resumo-categoria"
    );

    resumo.textContent =
        `${categoria}: ${quantidade} tarefa(s)`;

    painelOrdenar.appendChild(
        resumo
    );
}


// ======================================================
// BOTÃO DO PAINEL
// ======================================================

botaoOrdenar.addEventListener(
    "click",
    function() {
        atualizarPainelOrdenar();

        painelOrdenar.classList.toggle(
            "aberto"
        );
    }
);


// ======================================================
// CARREGAR TAREFAS INICIAIS
// ======================================================

tarefas.forEach(function(tarefa) {
    adicionarCard(tarefa);
});