const botaoMenu = document.querySelector(".botao-menu");
const fecharMenu = document.querySelector(".fechar-menu");
const menuLateral = document.querySelector(".menu-lateral");
const novaTarefa = document.querySelector(".nova-tarefa");
const areaFormulario = document.querySelector(".area-formulario");
const listaTarefas = document.querySelector(".lista-Tarefas");
const detalhesTarefa = document.querySelector(".detalhes-tarefa");
const mensagemInicial = document.querySelector(".mensagem-inicial");
const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

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

localStorage.setItem("tarefas", JSON.stringify(tarefas));

botaoMenu.addEventListener("click", function() {
    menuLateral.classList.add("aberto");
    mensagemInicial.classList.add("escondido");

});

fecharMenu.addEventListener("click", function() {
    menuLateral.classList.remove("aberto");
    areaFormulario.classList.remove("aberto");
    detalhesTarefa.classList.remove("aberto");
    detalhesTarefa.innerHTML = "";
    mensagemInicial.classList.remove("escondido");
});


function abrirDetalhes(tarefa) {
    mensagemInicial.classList.add("escondido");
    detalhesTarefa.classList.add("aberto");
    const totalPassos = tarefa.passos.length;
    const passosConcluidos = tarefa.passos.filter(function(passo) {
        return passo.concluido;
    }).length;


    const porcentagem = totalPassos === 0
        ? 0
        : Math.round((passosConcluidos / totalPassos) * 100);


    detalhesTarefa.innerHTML = `
        <div class="detalhes-conteudo">
            <div class="cabecalho-detalhes">
                <h2>${tarefa.titulo}</h2>
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

            <h3>Passo a passo</h3>

            <div class="lista-passos">

                ${
                    tarefa.passos.length === 0
                    ? `<p>Nenhum passo cadastrado.</p>`
                    : tarefa.passos.map(function(passo, indice) {
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
                    }).join("")
                }
            </div>
        </div>
    `;

    const checkboxes =
        detalhesTarefa.querySelectorAll(".passo input");

    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener("change", function() {
            const indice =
                Number(checkbox.dataset.indice);
            tarefa.passos[indice].concluido =
                checkbox.checked;
            localStorage.setItem(
                "tarefas",
                JSON.stringify(tarefas)
            );
            abrirDetalhes(tarefa);
        });
    });
}

function adicionarCard(tarefa) {
    const card = document.createElement("div");
    card.classList.add("card-Tarefa");
    card.innerHTML = `

        <h3>${tarefa.titulo}</h3>
        <p>${tarefa.descricao}</p>
        <p>Prioridade: ${tarefa.prioridade}</p>
        <p>Prazo: ${tarefa.prazo}</p>
        <button class="excluir">X</button>
    `;

    card.addEventListener("click", function() {
        abrirDetalhes(tarefa);
    });

    const botaoExcluir =
        card.querySelector(".excluir");
    botaoExcluir.addEventListener("click", function(event) {
        event.stopPropagation();
        card.remove();
        const indice =
            tarefas.indexOf(tarefa);
        tarefas.splice(indice, 1);
        localStorage.setItem(
            "tarefas",
            JSON.stringify(tarefas)
        );

        detalhesTarefa.classList.remove("aberto");
        detalhesTarefa.innerHTML = "";
    });


    listaTarefas.appendChild(card);

}

tarefas.forEach(function(tarefa) {
    adicionarCard(tarefa);
});

novaTarefa.addEventListener("click", function() {
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


    areaFormulario.classList.add("aberto");
    const formulario = document.querySelector(".formulario-tarefa");
    formulario.addEventListener("submit", function(event) {

        event.preventDefault();

    const titulo = formulario.querySelector("#titulo").value;
    const descricao = formulario.querySelector("#descricao").value;
    const passosTexto = formulario.querySelector("#passos").value;
    const passos = passosTexto

        .split("\n")
        .map(function(passo) {
            return {
            texto: passo.trim(),
            concluido: false
            };

            })

        .filter(function(passo) {
        return passo.texto !== "";});


    const prazo = formulario.querySelector("#prazo").value;
     const prioridade = formulario.querySelector("#prioridade").value;
     const tarefa = {
            titulo: titulo,
            descricao: descricao,
            passos: passos,
            prazo: prazo,
            prioridade: prioridade
    };

    tarefas.push(tarefa);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));

    adicionarCard(tarefa);

    formulario.reset();

    areaFormulario.classList.remove("aberto");

    });

    document.querySelector("#cancelar-tarefa").addEventListener("click", function() {
    areaFormulario.classList.remove("aberto");
    });
});