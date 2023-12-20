document.addEventListener('DOMContentLoaded', function () {


    document.getElementById('cadastrarEvento').addEventListener('click', function () {
        // Exibir modal de cadastro de evento
        openModalEventos();

        document.getElementById('cancelarEvento').addEventListener('click', function () {
            closeModalEventos();
        });

        document.getElementById('salvarEdicaoEvento').addEventListener('click', function () {
            editarEvento(membroId);  // Garanta que membroId esteja definido
        });

        // Configurar listener para o botão "Salvar"
        document.getElementById('salvarNovoEvento').addEventListener('click', function () {
            cadastrarNovoEvento();
        });
    });


    // Defina a função criarBotaoAcao
    function criarBotaoAcao(texto, cor, onClickCallback) {
        var botao = document.createElement('button');
        botao.textContent = texto;
        botao.classList.add('button', cor);
        botao.addEventListener('click', onClickCallback);
        return botao;
    }

    const openModalEventos = () => {
        const modalEventos = document.getElementById('modalEventos');
        if (modalEventos) {
            modalEventos.classList.add('active');
        } else {
            console.error('Elemento modalEventos não encontrado.');
        }
    };

    const closeModalEventos = () => {
        const modalEventos = document.getElementById('modalEventos');
        if (modalEventos) {
            modalEventos.classList.remove('active');
        }
    };




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
        var data = new Date(partes[2], partes[1] - 1, partes[0]); // ano, mês (subtrai 1 porque janeiro é 0), dia
        return data.toISOString().split('T')[0];
    }

    function editarEvento(eventoId) {
        // Obter dados do formulário
        var nomeEvento = document.getElementById('nomeEventoInput').value;
        var dataEvento = document.getElementById('dataEventoInput').value;
        var localizacao = document.getElementById('localizacaoInput').value;

        // Validar dados (se necessário)

        // Montar objeto do evento editado
        var eventoEditado = {
            "nomeEvento": nomeEvento,
            "dataEvento": dataEvento,
            "localizacao": localizacao
        };

        // Enviar requisição PUT para editar o evento
        fetch(`http://localhost:8080/api/eventos/${eventoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(eventoEditado),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Evento editado com sucesso:', data);
                // Atualizar dados na tabela ou realizar outras ações necessárias
                // Fechar modal
                closeModalEventos();
            })
            .catch(error => {
                console.error('Erro ao editar evento:', error);
            });
    }

    document.getElementById('pesquisarPorId').addEventListener('click', function () {
        pesquisarEventosPorId();
    });

    function pesquisarEventosPorId() {
        limparTabelaEventos();

        // Obtém o valor do campo de pesquisa por ID
        var eventoId = document.getElementById('variavel').value;

        // Faz a requisição GET para pesquisar o evento por ID
        fetch(`http://localhost:8080/api/eventos/${eventoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(evento => {
                console.log('Evento encontrado:', evento);
                adicionarEventoATabela(evento);
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    }

    // Adiciona um ouvinte de evento ao botão de listar eventos
    document.getElementById('listarEventos').addEventListener('click', function () {
        // Limpa a tabela antes de listar os eventos novamente
        limparTabelaEventos();

        // Faz a requisição GET para listar todos os eventos
        fetch('http://localhost:8080/api/eventos')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                data.forEach(evento => adicionarEventoATabela(evento));
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    });


    // Adiciona um ouvinte de evento ao botão de excluir eventos na tabela
    document.getElementById('eventosTableBody').addEventListener('click', function (event) {
        if (event.target.classList.contains('button.red')) {
            membroId = event.target.dataset.membroId;
            excluirEvento(membroId);
        }
    });




    // Função para adicionar um evento à tabela dinamicamente
    function adicionarEventoATabela(evento) {
        var tableBody = document.getElementById("eventosTableBody");
        var newRow = tableBody.insertRow();

        // Adiciona as células da nova linha
        var nomeEventoCell = newRow.insertCell(0);
        var dataEventoCell = newRow.insertCell(1);
        var localizacaoCell = newRow.insertCell(2);
        var acaoCell = newRow.insertCell(3);

        // Preenche as células com os dados do novo evento
        nomeEventoCell.innerHTML = evento.nomeEvento;
        dataEventoCell.innerHTML = evento.dataEvento;
        localizacaoCell.innerHTML = evento.localizacao;

        // Cria o botão de exclusão dinamicamente
        var botaoExcluir = criarBotaoAcao('Excluir', 'red', function () {
            excluirEvento(evento.eventoId);
        });

        // Cria o botão de edição dinamicamente
        var botaoEditar = criarBotaoAcao('Editar', 'blue', function () {
            abrirModalEdicaoEvento(evento);
        });

        // Adiciona os botões à célula de ação
        acaoCell.appendChild(botaoEditar);
        acaoCell.appendChild(botaoExcluir);
    }
    function preencherFormularioEvento(evento) {
        document.getElementById('nomeEventoInput').value = evento.nomeEvento;
        document.getElementById('dataEventoInput').value = evento.dataEvento;
        document.getElementById('localizacaoInput').value = evento.localizacao;
    }

    function abrirModalEdicaoEvento(evento) {
        // Abre o modal
        openModalEventos();

        // Preencher campos do formulário com os dados do evento
        preencherFormularioEvento(evento);

        // Configurar listener para o botão "Salvar Edição"
        document.getElementById('salvarEdicaoEvento').addEventListener('click', function () {
            editarEvento(evento.eventoId);
        });
    }


    // Adiciona um ouvinte de evento ao botão de fechar o modal de eventos
    document.getElementById('modalCloseEventos').addEventListener('click', closeModalEventos);


    function limparTabelaEventos() {
        const tableBody = document.getElementById('eventosTableBody');
        if (tableBody) {
            tableBody.innerHTML = ''; // Remove todas as linhas da tabela
        } else {
            console.error('Elemento com ID eventosTableBody não encontrado.');
        }
    }


    // Função auxiliar para configurar o botão de salvar edição de eventos
    function configurarBotaoSalvarEdicaoEvento(eventoId) {
        var botaoSalvarEdicao = document.getElementById('salvarEdicaoEvento');
        if (botaoSalvarEdicao) {
            botaoSalvarEdicao.addEventListener('click', function () {
                editarEvento(eventoId);
            });
        } else {
            console.error('Elemento salvarEdicaoEvento não encontrado.');
        }
    }



    // Adiciona um ouvinte de evento ao botão de fechar o modal de eventos
    document.getElementById('modalCloseEventos').addEventListener('click', closeModalEventos);



    // Função para remover evento da tabela
    function removerEventoDaTabela(eventoId) {
        var tableBody = document.getElementById('eventosTableBody');
        var rows = tableBody.getElementsByTagName('tr');

        // Procurar e remover a linha correspondente ao evento excluído
        for (var i = 0; i < rows.length; i++) {
            var row = rows[i];
            if (row.dataset.eventoId == eventoId) {
                tableBody.removeChild(row);
                break;
            }
        }
    }



    // Função para cadastrar um novo evento
    function cadastrarNovoEvento() {
        // Obter dados do formulário
        var nomeEvento = document.getElementById('nomeEventoInput').value;
        var dataEvento = document.getElementById('dataEventoInput').value;
        var localizacao = document.getElementById('localizacaoInput').value;

        // Validar dados (se necessário)

        // Montar objeto do novo evento
        var novoEvento = {
            "nomeEvento": nomeEvento,
            "dataEvento": dataEvento,
            "localizacao": localizacao
        };

        // Enviar requisição POST para adicionar o evento
        fetch('http://localhost:8080/api/eventos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novoEvento),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Evento adicionado com sucesso:', data);
                // Adicionar evento à tabela
                adicionarEventoATabela(data);
                // Fechar modal
                closeModalEventos();
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    // Função para excluir um membro
    function excluirEvento(eventoId) {
        // Faz a requisição DELETE para excluir o membro
        fetch(`http://localhost:8080/api/eventos/${eventoId}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao excluir evento');
                }
                // Não tenta fazer o parsing da resposta, pois é uma requisição DELETE
                console.log('Evento excluído com sucesso');

                // Mostra uma mensagem de sucesso ao usuário
                alert('Evento excluído com sucesso!');

                // Agora, você pode habilitar o botão "Listar Membros"
                document.getElementById('listarEventos').disabled = false;
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }




    document.getElementById('eventosTableBody').addEventListener('click', function (event) {
        if (event.target.classList.contains('button.red')) {
            var eventoId = event.target.dataset.eventoId;  // Corrigido para eventoId
            excluirEvento(eventoId);  // Corrigido para excluirEvento
        }
    });



});