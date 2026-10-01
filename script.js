const botaoMenu = document.querySelector(".botao-menu");
const fecharMenu = document.querySelector(".fechar-menu");
const menuLateral = document.querySelector(".menu-lateral");
const conteudo = document.querySelector(".conteudo");
const novaTarefa = document.querySelector(".nova-tarefa");
const areaFormulario = document.querySelector(".area-formulario");
const areaConcluido = document.querySelector(".area-concluido");
const concluido = document.querySelector(".concluido");
const listaTarefas = document.querySelector(".lista-Tarefas");

const tarefas = [];

botaoMenu.addEventListener("click", function() {
    menuLateral.classList.add("aberto");
    conteudo.classList.add("escondido");
});

fecharMenu.addEventListener("click", function() {
    menuLateral.classList.remove("aberto");
    conteudo.classList.remove("escondido");
    areaFormulario.classList.remove("aberto");
});

function adicionarCard(tarefa) {
    const card = document.createElement("div");
    card.classList.add("card-Tarefa");

    card.innerHTML = `
        <h3>${tarefa.titulo}</h3>
        <p>${tarefa.descricao}</p>
        <p>Prioridade: ${tarefa.prioridade}</p>
        <p>Prazo: ${tarefa.prazo}</p>
        <button class="excluir"> X </button>
    `;
    
    const botaoExcluir = card.querySelector(".excluir");
    botaoExcluir.addEventListener("click", function(){
        card.remove();
    });

    listaTarefas.appendChild(card);
}

novaTarefa.addEventListener("click", function() {

    areaFormulario.innerHTML = `
        <form class="formulario-tarefa">

            <h3>Nova tarefa</h3>

            <label for="titulo">Título</label>

            <input 
                type="text" 
                id="titulo" 
                name="titulo"
                placeholder="Título da tarefa"
                required
            >

            <label for="descricao">Descrição</label>

            <textarea 
                id="descricao" 
                name="descricao"
                placeholder="Descrição da tarefa"
                required
            ></textarea>

            <label for="passos">Passo a passo</label>

            <textarea 
                id="passos" 
                name="passos"
                placeholder="Descreva os passos da tarefa"
            ></textarea>

            <label for="prazo">Prazo</label>

            <input 
                type="date" 
                id="prazo" 
                name="prazo"
                required
            >

            <label for="prioridade">Prioridade</label>

            <select 
                id="prioridade" 
                name="prioridade"
                required
            >
                <option value="">Selecione</option>
                <option value="baixa">Baixa</option>
                <option value="media">Média</option>
                <option value="alta">Alta</option>
            </select>

            <button type="submit" class="criar-tarefa">
                ✓ Criar tarefa
            </button>

            <button type="button" id="cancelar-tarefa">
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
        const passos = formulario.querySelector("#passos").value;
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

        adicionarCard(tarefa);

        console.log(tarefas);

        formulario.reset();
        areaFormulario.classList.remove("aberto");
    });

    document.querySelector("#cancelar-tarefa").addEventListener("click", function() {
        areaFormulario.classList.remove("aberto");
    });
});





areaConcluido.addEventListener("click", function() {
    areaConcluido.classList.add("aberto");
    concluido.classList.add("escondido");
});