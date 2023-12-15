document.addEventListener("DOMContentLoaded", function () {
    'use strict';

    const openModal = () => document.getElementById('modal').classList.add('active');
    const closeModal = () => document.getElementById('modal').classList.remove('active');

    document.getElementById('cadastrarCliente').addEventListener('click', openModal);
    document.getElementById('modalClose').addEventListener('click', closeModal);

    // Adiciona um ouvinte de evento de entrada (input) para o campo de data
    var dataInscricaoInput = document.getElementById("dataInscricaoInput");
    dataInscricaoInput.addEventListener("input", function () {
        formatarMascaraData(dataInscricaoInput);
    });
    

    // Adiciona um ouvinte de evento ao botão de salvar membro
    document.getElementById('salvarMembro').addEventListener('click', function (event) {
        event.preventDefault();
        

        // Coleta os dados do formulário
        var nome = document.getElementById("nomeInput").value;
        var email = document.getElementById("emailInput").value;
        var telefone = document.getElementById("telefoneInput").value;
        var cidade = document.getElementById("cidadeInput").value;
        var dataInscricaoInput = document.getElementById("dataInscricaoInput").value;

        // Formata a data (ano-mes-dia)
        var dataInscricao = formatarData(dataInscricaoInput);

        // Monta o objeto a ser enviado no formato JSON
        var novoMembro = {
            "nome": nome,
            "email": email,
            "telefone": telefone,
            "cidade": cidade,
            "dataInscricao": dataInscricao
        };

        // Envia a requisição POST para o backend
        fetch('http://localhost:8080/api/membros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoMembro),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao adicionar membro');
                }
                return response.json();
            })
            .then(data => {
                console.log('Membro adicionado com sucesso:', data);
                
                adicionarMembroATabela(data);
            })
            .catch(error => {
                console.error('Erro:', error);
            });

        // Fecha o modal
        document.getElementById("modal").style.display = "none";
    });

    // Adiciona um ouvinte de evento ao botão de listar membros
    document.getElementById('listarMembros').addEventListener('click', function () {
        // Limpa a tabela antes de listar os membros novamente
        limparTabela();

        // Faz a requisição GET para listar todos os membros
        fetch('http://localhost:8080/api/membros')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao obter membros');
                }
                return response.json();
            })
            .then(data => {
                // Adiciona cada membro à tabela
                data.forEach(membro => adicionarMembroATabela(membro));
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    });

    document.getElementById('pesquisarMembros').addEventListener('click', function () {
        // Chama a função para pesquisar membros quando o botão "Pesquisar Membros" é clicado
        pesquisarMembros();
    });

    function limparTabelaMembros() {
        var tabela = document.getElementById('membrosTableBody');
        tabela.innerHTML = ''; 
    }
    
    function pesquisarMembros() {
       
        limparTabelaMembros();
    
        // Obtém os valores da caixa de seleção e do campo de pesquisa
        var searchType = document.getElementById('searchType').value;
        var searchValue = document.getElementById('searchValue').value;
    
        // Faz a requisição GET para pesquisar os membros com base no tipo de pesquisa e valor
        fetch(`http://localhost:8080/api/membros/${searchType}/${searchValue}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(membro => adicionarMembroATabela(membro));
            })
            .catch(error => {
                console.error('Erro na requisição:', error.message); // Loga detalhes do erro
            });
    }
    

    // Função para formatar a máscara da data (xx-xx-xxxx)
    function formatarMascaraData(input) {
        var valor = input.value.replace(/\D/g, ''); // Remove caracteres não numéricos
        var tamanho = valor.length;

        if (tamanho > 2 && tamanho < 5) {
            input.value = valor.substr(0, 2) + '-' + valor.substr(2);
        } else if (tamanho >= 5 && tamanho < 9) {
            input.value = valor.substr(0, 2) + '-' + valor.substr(2, 2) + '-' + valor.substr(4);
        } else if (tamanho >= 9) {
            input.value = valor.substr(0, 2) + '-' + valor.substr(2, 2) + '-' + valor.substr(4, 4);
        }
    }

    // Função para formatar a data (ano-mes-dia)
    function formatarData(dataInput) {
        var partes = dataInput.split('-');
        var data = new Date(partes[2], partes[1] - 1, partes[0]); 
        return data.toISOString().split('T')[0];
    }

    // Função para adicionar um membro à tabela dinamicamente
    function adicionarMembroATabela(membro) {
        var tableBody = document.getElementById("membrosTableBody");
        var newRow = tableBody.insertRow();

        // Adiciona as células da nova linha
        var nomeCell = newRow.insertCell(0);
        var emailCell = newRow.insertCell(1);
        var telefoneCell = newRow.insertCell(2);
        var cidadeCell = newRow.insertCell(3);
        var dataInscricaoCell = newRow.insertCell(4);
        var acaoCell = newRow.insertCell(5);

        // Preenche as células com os dados do novo membro
        nomeCell.innerHTML = membro.nome;
        emailCell.innerHTML = membro.email;
        telefoneCell.innerHTML = membro.telefone;
        cidadeCell.innerHTML = membro.cidade;
        dataInscricaoCell.innerHTML = membro.dataInscricao;

        // Cria o botão de exclusão dinamicamente
        var botaoExcluir = criarBotaoAcao('Excluir', 'red', function () {
            excluirMembro(membro.membroId);
        });

        // Cria o botão de edição dinamicamente
        var botaoEditar = criarBotaoAcao('Editar', 'blue', function () {
            abrirModalEdicao(membro);
        });

        // Adiciona os botões à célula de ação
        acaoCell.appendChild(botaoEditar);
        acaoCell.appendChild(botaoExcluir);
    }

    // Função auxiliar para criar botões de ação
    function criarBotaoAcao(texto, cor, callback) {
        var botao = document.createElement('button');
        botao.type = 'button';
        botao.classList.add('button', cor);
        botao.textContent = texto;
        botao.addEventListener('click', callback);
        return botao;
    }

    function abrirModalEdicao(membro) {
        // Abre o modal
        document.getElementById('modal').classList.add('active');

        // Esconde o botão "Salvar"
        document.getElementById('salvarMembro').style.display = 'none';

        // Preenche os campos do formulário com os dados do membro
        preencherFormulario(membro);

        // Configura o botão de salvar para realizar a edição
        var botaoSalvarEdicao = document.getElementById("salvarEdicaoMembro");
        if (botaoSalvarEdicao) {
            botaoSalvarEdicao.addEventListener('click', function () {
                editarMembro(membro.membroId);
            });
        } else {
            console.error('Elemento salvarEdicaoMembro não encontrado.');
        }
    }

    // Função auxiliar para preencher o formulário com os dados do membro
    function preencherFormulario(membro) {
        document.getElementById('nomeInput').value = membro.nome;
        document.getElementById('emailInput').value = membro.email;
        document.getElementById('telefoneInput').value = membro.telefone;
        document.getElementById('cidadeInput').value = membro.cidade;
        document.getElementById('dataInscricaoInput').value = membro.dataInscricao;
    }

    function configurarBotaoSalvarEdicao(membroId) {
        var botaoSalvarEdicao = document.getElementById("salvarEdicaoMembro");
        if (botaoSalvarEdicao) {
            botaoSalvarEdicao.addEventListener('click', function () {
                
            });
        } else {
            console.error('Elemento salvarEdicaoMembro não encontrado.');
        }
    }



    function editarMembro(membroId) {
        // Coleta os dados do formulário
        var nome = document.getElementById('nomeInput').value;
        var email = document.getElementById('emailInput').value;
        var telefone = document.getElementById('telefoneInput').value;
        var cidade = document.getElementById('cidadeInput').value;
        var dataInscricaoInput = document.getElementById('dataInscricaoInput').value;

        // Formata a data (ano-mes-dia)
        var dataInscricao = formatarData(dataInscricaoInput);

        // Monta o objeto a ser enviado no formato JSON
        var membroEditado = {
            nome: nome,
            email: email,
            telefone: telefone,
            cidade: cidade,
            dataInscricao: dataInscricao
        };

        // Envia a requisição PUT para o backend
        fetch('http://localhost:8080/api/membros/' + membroId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(membroEditado),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Membro editado com sucesso:', data);
                // Atualiza os dados na tabela
                atualizarMembroNaTabela(data);
            })
            .catch(error => {
                console.error('Erro ao editar membro:', error);
            });

        // Fecha o modal
        document.getElementById('modal').classList.remove('active');
    }

    // Função auxiliar para atualizar os dados de um membro na tabela após a edição
    function atualizarMembroNaTabela(membroEditado) {
        // Encontra a linha correspondente na tabela
        var tableBody = document.getElementById('membrosTableBody');
        var rows = Array.from(tableBody.children);
        var rowToUpdate = rows.find(row => row.cells[5].querySelector('.button.red').dataset.membroId === membroEditado.membroId);

        if (rowToUpdate) {
            // Atualiza os dados na tabela
            preencherLinhaTabela(rowToUpdate, membroEditado);
        }
    }

    // Função auxiliar para preencher uma linha da tabela com dados de um membro
    function preencherLinhaTabela(row, membro) {
        row.cells[0].innerHTML = membro.nome;
        row.cells[1].innerHTML = membro.email;
        row.cells[2].innerHTML = membro.telefone;
        row.cells[3].innerHTML = membro.cidade;
        row.cells[4].innerHTML = membro.dataInscricao;
    }


    // Função para remover um membro da tabela
    function removerMembroDaTabela(membroId) {
        var tableBody = document.getElementById("membrosTableBody");
        var rowToRemove = Array.from(tableBody.children).find(row => {
            var cell = row.cells[5];
            var buttonRed = cell.querySelector('.button.red');

            // Verifica se a célula e o botão estão presentes
            if (cell && buttonRed) {
                var onclickAttribute = buttonRed.getAttribute('onclick');

                // Verifica se o atributo onclick contém o membroId
                if (onclickAttribute && onclickAttribute.includes(membroId)) {
                    tableBody.removeChild(row);
                }
            }
        });
    }


    // Função para excluir um membro
    function excluirMembro(membroId) {
        // Faz a requisição DELETE para excluir o membro
        fetch(`http://localhost:8080/api/membros/${membroId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir membro');
                }
                // Não tenta fazer o parsing da resposta, pois é uma requisição DELETE
                console.log('Membro excluído com sucesso');

                // Mostra uma mensagem de sucesso ao usuário
                alert('Membro excluído com sucesso!');

                // Agora, você pode habilitar o botão "Listar Membros"
                document.getElementById('listarMembros').disabled = false;
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    // Adiciona um ouvinte de evento ao botão de excluir membros
    document.getElementById('membrosTableBody').addEventListener('click', function (event) {
        if (event.target.classList.contains('button.red')) {
            var membroId = event.target.dataset.membroId;
            excluirMembro(membroId);
        }
    });

    // Adiciona um ouvinte de evento ao botão de listar membros
    document.getElementById('listarMembros').addEventListener('click', function () {
        // Agora, você pode implementar a lógica para listar os membros
        console.log('Listar membros clicado');

        // Adicionalmente, você pode desativar o botão "Listar Membros" novamente se necessário
        // document.getElementById('listarMembros').disabled = true;
    });

    


    // Função para limpar a tabela
    function limparTabela() {
        var tableBody = document.getElementById("membrosTableBody");

        tableBody.innerHTML = ''; // Remove todas as linhas da tabela
    }

    

});
