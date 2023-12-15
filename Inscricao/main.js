document.addEventListener('DOMContentLoaded', function () {

    var cadastrarInscricaoButton = document.getElementById('cadastrarInscricao');

    document.getElementById('modalCloseInscricao').addEventListener('click', function () {
        closeModalInscricao();
    });

    document.getElementById('cancelarInscricao').addEventListener('click', function () {
        closeModalInscricao();
    });

    document.getElementById('listarInscricao').addEventListener('click', function () {
        // Limpa a tabela antes de listar as inscrições novamente
        limparTabelaInscricoes();

        // Faz a requisição GET para listar todas as inscrições
        fetch('http://localhost:8080/api/inscricoes')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(inscricao => adicionarInscricaoATabela(inscricao));
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    });

    function criarBotaoAcao(texto, cor, onClickCallback) {
        var botao = document.createElement('button');
        botao.textContent = texto;
        botao.classList.add('button', cor);
        botao.addEventListener('click', onClickCallback);
        return botao;
    }



    function adicionarInscricaoATabela(inscricao) {
        var tableBody = document.getElementById("inscricoesTableBody");
        var newRow = tableBody.insertRow();

        // Adiciona as células da nova linha
        var nomeMembroCell = newRow.insertCell(0);
        var nomeEventoCell = newRow.insertCell(1);
        var dataInscricaoCell = newRow.insertCell(2);
        var acaoCell = newRow.insertCell(3);

        // Preenche as células com os dados da nova inscrição
        nomeMembroCell.innerHTML = inscricao.membro.nome;
        nomeEventoCell.innerHTML = inscricao.evento.nomeEvento;
        dataInscricaoCell.innerHTML = inscricao.dataInscricao;

        // Cria os botões dinamicamente (editar, excluir e detalhes)
        var botaoEditar = criarBotaoAcao('Editar', 'blue', function () {
            
            console.log('Editar inscrição:', inscricao);
        });

        var botaoExcluir = criarBotaoAcao('Excluir', 'red', function () {
            excluirInscricao(inscricao.inscricaoId);
        });

        var botaoDetalhes = criarBotaoAcao('Detalhes', 'gray', function () {
            // Lógica para exibir detalhes de uma inscrição
            console.log('Detalhes da inscrição:', inscricao);
        });

        

        acaoCell.appendChild(botaoExcluir);

    }

    // Função para excluir um membro
    function excluirInscricao(inscricaoId) {
        // Confirme se o usuário realmente deseja excluir a inscrição
        var confirmacao = confirm('Deseja realmente excluir esta inscrição?');

        if (confirmacao) {
            // Enviar requisição DELETE para excluir a inscrição
            fetch(`http://localhost:8080/api/inscricoes/${inscricaoId}`, {
                method: 'DELETE',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Inscrição excluída com sucesso:', data);
                    // Atualize a interface conforme necessário, removendo a linha da tabela, por exemplo
                    limparTabelaInscricoes();
                    listarInscricoes(); 
                })
                .catch(error => {
                    console.error('Erro ao excluir inscrição:', error);
                    
                });
        }
    }

    // Função auxiliar para limpar a tabela de inscrições
    function limparTabelaInscricoes() {
        const tableBody = document.getElementById('inscricoesTableBody');
        if (tableBody) {
            tableBody.innerHTML = ''; 
        } else {
            console.error('Elemento com ID inscricoesTableBody não encontrado.');
        }
    }

    document.getElementById('salvarNovoInscricao').addEventListener('click', function () {
        realizarInscricao(/* passar o objeto 'evento' como argumento */);
    });


    // Verifica se o botão foi encontrado
    if (cadastrarInscricaoButton) {
        
        cadastrarInscricaoButton.addEventListener('click', function () {
           
            handleCadastrarInscricaoClick();
        });
        
    } else {
        console.error('Elemento com ID "cadastrarInscricao" não encontrado.');
    }

    // função para lidar com o clique no botão "Cadastrar Inscrição"
    function handleCadastrarInscricaoClick() {
       
        openModalInscricao();
    }


    // Função para abrir o modal de cadastro de inscrição
    function openModalInscricao() {
        const modalInscricao = document.getElementById('modalInscricao');
        if (modalInscricao) {
            modalInscricao.classList.add('active');
        } else {
            console.error('Elemento modalInscricao não encontrado.');
        }
    }

    // Função para fechar o modal de cadastro de inscrição
    function closeModalInscricao() {
        const modalInscricao = document.getElementById('modalInscricao');
        if (modalInscricao) {
            modalInscricao.classList.remove('active');
        }
    }


    // Função para adicionar um evento à tabela dinamicamente
    function adicionarEventoATabela(evento) {
        var tableBody = document.getElementById("eventosTableBody");
        var newRow = tableBody.insertRow();

       
        var botaoInscrever = criarBotaoAcao('Inscrever', 'green', function () {
            abrirModalInscricao(evento);
        });

        
        acaoCell.appendChild(botaoEditar);
        acaoCell.appendChild(botaoExcluir);
        acaoCell.appendChild(botaoInscrever);
    }

    // Função para abrir o modal de inscrição
    function abrirModalInscricao(evento) {
       
        openModalInscricao();

        
        preencherFormularioInscricao(evento);

        
        document.getElementById('inscreverEvento').addEventListener('click', function () {
            realizarInscricao(evento.eventoId);
        });
    }

    // Função para preencher o formulário de inscrição com dados do evento
    function preencherFormularioInscricao(evento) {
        // Preencha os campos do formulário conforme necessário
    }

    function realizarInscricao(eventoId) {
        // Obter dados do formulário
        var membroIdInput = document.getElementById('membroIdInput');
        var nomeInscritoInput = document.getElementById('nomeMembroInput');

        // Verifica se os elementos foram encontrados
        if (membroIdInput && nomeInscritoInput) {
            var membroId = membroIdInput.value;
            var nomeInscrito = nomeInscritoInput.value;

            // Realizar a pesquisa do membro por ID
            fetch(`http://localhost:8080/api/membros/${membroId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(membroData => {
                    
                    var inscricaoData = {
                        "membro": {
                            "membroId": membroData.membroId,
                            "nome": membroData.nome,
                            
                        },
                        "evento": {
                            "eventoId": eventoId,
                            
                        },
                        "dataInscricao": new Date().toISOString().split('T')[0], 
                    };

                    // Enviar requisição POST para realizar a inscrição
                    return fetch('http://localhost:8080/api/inscricoes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(inscricaoData),
                    });
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Inscrição realizada com sucesso:', data);
                    // Exibir mensagem de sucesso ou atualizar a interface conforme necessário
                })
                .catch(error => {
                    console.error('Erro ao realizar inscrição:', error);
                    // Exibir mensagem de falha ou atualizar a interface conforme necessário
                });
        } else {
            console.error('Elementos de input não encontrados.');
        }
    }

});
