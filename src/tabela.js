document.addEventListener('DOMContentLoaded', () => {
    const tabela = document.getElementById('resultado');
    const nomeInput = document.getElementById('nome');
    const cargoSelect = document.getElementById('cargo');
    const salvarBtn = document.querySelector('button');
    let idAtual = null; // Armazena o ID do registro sendo editado

    async function mostrarClientes() {
        tabela.innerHTML = '';

        try {
            const response = await fetch('/pegapessoas');
            if (!response.ok) {
                throw new Error('Falha ao buscar registros');
            }

            const entradas = await response.json();
            entradas.forEach((entry) => {
                let novaLinha = tabela.insertRow();
                novaLinha.insertCell(0).innerText = entry.nome;
                novaLinha.insertCell(1).innerText = entry.cargo;

                // Criar botão "Editar"
                let editarBtn = document.createElement('button');
                editarBtn.innerText = 'Editar';
                editarBtn.addEventListener('click', () => editarCliente(entry));

                let acoesCell = novaLinha.insertCell(2);
                acoesCell.appendChild(editarBtn);
            });

        } catch (err) {
            console.error('Erro ao buscar pessoas:', err);
        }
    }

    function editarCliente(entry) {
        nomeInput.value = entry.nome;
        cargoSelect.value = entry.cargo;
        idAtual = entry.id; // Armazena o ID para edição
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

            mostrarClientes(); // Atualiza a tabela após edição
        } catch (error) {
            console.error('Erro ao atualizar:', error);
        }
    });

    mostrarClientes();
});
