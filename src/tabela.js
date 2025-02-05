document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.getElementById('resultado');
    const nomeInput = document.getElementById('nome');
    const cargoSelect = document.getElementById('cargo');
    const salvarBtn = document.getElementById('salvar');
    const buscadorInput = document.getElementById('buscador');
    const buscarBtn = document.getElementById('buscar');
    let registros = []; // Armazena todos os registros carregados
    let idAtual = null;

    async function mostrarClientes(filtrados = null) {
        tabela.innerHTML = ''; // Limpa a tabela antes de mostrar os dados
        const dados = filtrados || registros; // Usa os dados filtrados ou todos os registros

        dados.forEach((entry) => {
            let novaLinha = tabela.insertRow();
            novaLinha.insertCell(0).innerText = entry.nome;
            novaLinha.insertCell(1).innerText = entry.cargo;

            let editarBtn = document.createElement('button');
            editarBtn.innerText = 'Editar';
            editarBtn.addEventListener('click', () => editarCliente(entry));

            let excluirBtn = document.createElement('button');
            excluirBtn.innerText = 'Excluir';
            excluirBtn.addEventListener('click', () => deletarCliente(entry.id));

            let acoesCell = novaLinha.insertCell(2);
            acoesCell.appendChild(editarBtn);
            acoesCell.appendChild(excluirBtn);
        });
    }

    async function carregarClientes() {
        try {
            const response = await fetch('/pegapessoas');
            if (!response.ok) {
                throw new Error('Erro ao buscar registros');
            }

            registros = await response.json(); // Armazena todos os registros
            mostrarClientes(); // Exibe na tabela
        } catch (err) {
            console.error('Erro ao buscar clientes:', err);
        }
    }

    function editarCliente(entry) {
        nomeInput.value = entry.nome;
        cargoSelect.value = entry.cargo;
        idAtual = entry.id;

        nomeInput.disabled = false;
        cargoSelect.disabled = false;
        salvarBtn.disabled = false;
    }

    salvarBtn.addEventListener('click', async () => {
        
        if (!idAtual) {
            alert('Nenhum registro selecionado para edição.');
            return;
        }

        const nome = nomeInput.value.trim();
        const cargo = cargoSelect.value;

        if (!nome || !cargo) {
            alert('Preencha todos os campos.');
            return;
        }

        try {
            const response = await fetch(`/atualizar/${idAtual}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome, cargo })
            });

            if (!response.ok) {
                throw new Error('Erro ao atualizar registro');
            }

            alert('Registro atualizado com sucesso!');
            nomeInput.value = '';
            cargoSelect.value = '';
            idAtual = null;

            nomeInput.disabled = true;
            cargoSelect.disabled = true;
            salvarBtn.disabled = true;

            carregarClientes(); // Atualiza a tabela
        } catch (error) {
            console.error('Erro ao atualizar:', error);
        }
    });

    async function deletarCliente(id) {
        if (confirm('Tem certeza que deseja excluir este registro?')) {
            try {
                const response = await fetch(`/deletar/${id}`, { method: 'DELETE' });

                if (!response.ok) {
                    throw new Error('Erro ao excluir registro');
                }

                alert('Registro excluído com sucesso!');
                carregarClientes(); // Atualiza a tabela
            } catch (error) {
                console.error('Erro ao excluir:', error);
            }
        }
    }

    // Função para buscar e filtrar resultados
    buscarBtn.addEventListener('click', async () => {
        const termo = buscadorInput.value.trim();
    
        if (!termo) {
            alert("Digite um nome ou cargo para buscar.");
            return;
        }
    
        try {
            const response = await fetch(`/buscar?termo=${encodeURIComponent(termo)}`);
            if (!response.ok) {
                throw new Error("Nenhum resultado encontrado.");
            }
    
            const dadosFiltrados = await response.json();
            mostrarClientes(dadosFiltrados); // Atualiza a tabela com os resultados
        } catch (error) {
            alert(error.message);
            mostrarClientes([]); // Limpa a tabela se não encontrar nada
        }
    });
    

    carregarClientes();
});
