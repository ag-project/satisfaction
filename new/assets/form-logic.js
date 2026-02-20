document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const ticketId = urlParams.get('id_ticket');

    const endpointGetURL = "https://dlyebhhe5cd3ujktcfdrrueh6a0eeakh.lambda-url.us-east-1.on.aws";
    const endpointPostURL = "https://slfdtardiaoxncbc434urbo3wi0gyfmr.lambda-url.us-east-1.on.aws";

    // Elementos da Interface
    const loading = document.getElementById('loading');
    const wrapEvaluation = document.getElementById('wrap-evaluation');
    const npsForm = document.getElementById('nps-form');
    const npsOptions = document.querySelectorAll('.nps-option');
    const commentContainer = document.getElementById('comment-container');
    const submitButton = document.getElementById('submit-button');
    const successMessage = document.getElementById('success-message');
    const expiredMessage = document.getElementById('expired');
    const permissionMessage = document.getElementById('permission');

    // Erros
    const npsError = document.getElementById('nps-error');
    const additionalError = document.getElementById('additional-error');

    let selectedNpsValue = null;

    // Inicialização
    if (!ticketId) {
        permissionMessage.classList.remove('hidden');
        return;
    }

    checkTicketStatus();

    // Funções Auxiliares
    function showLoading(show) {
        if (show) loading.classList.remove('hidden');
        else loading.classList.add('hidden');
    }

    async function checkTicketStatus() {
        showLoading(true);
        try {
            const response = await fetch(`${endpointGetURL}?ticketId=${ticketId}`);
            const data = await response.json();

            if (data.status === 'already_evaluated' || data.status === 'expired') {
                expiredMessage.classList.remove('hidden');
            } else {
                wrapEvaluation.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Erro ao verificar ticket:', error);
            // Em caso de erro na API, mostramos o formulário por precaução
            wrapEvaluation.classList.remove('hidden');
        } finally {
            showLoading(false);
        }
    }

    // Interação NPS
    npsOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Resetar seleções anteriores
            npsOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedNpsValue = this.getAttribute('data-value');
            
            // Esconder erro se houver
            npsError.classList.add('hidden');

            // Mostrar perguntas condicionais
            showConditionalQuestions(selectedNpsValue);
            commentContainer.classList.remove('hidden');
        });
    });

    function showConditionalQuestions(value) {
        // Esconder todas primeiro
        document.querySelectorAll('.additional-questions').forEach(q => q.classList.add('hidden'));
        
        let targetId = '';
        if (value <= 2) targetId = 'additional-questions-1-2';
        else if (value == 3) targetId = 'additional-questions-3-3';
        else targetId = 'additional-questions-4-5';

        const target = document.getElementById(targetId);
        if (target) target.classList.remove('hidden');
    }

    // Submissão do Formulário
    npsForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validação
        let isValid = true;
        
        if (!selectedNpsValue) {
            npsError.classList.remove('hidden');
            isValid = false;
        }

        const additionalResponse = document.querySelector('input[name="additional-response"]:checked');
        if (!additionalResponse) {
            additionalError.classList.remove('hidden');
            isValid = false;
        } else {
            additionalError.classList.add('hidden');
        }

        if (!isValid) return;

        // Início do envio
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        showLoading(true);

        const comment = document.getElementById('comment').value;
        const postURL = `${endpointPostURL}?ticketId=${encodeURIComponent(ticketId)}&npsValue=${encodeURIComponent(selectedNpsValue)}&comment=${encodeURIComponent(comment)}&additionalResponse=${encodeURIComponent(additionalResponse.value)}`;

        try {
            const response = await fetch(postURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                npsForm.classList.add('hidden');
                successMessage.classList.remove('hidden');
                
                // Mostrar popup RA se a nota for alta (4 ou 5)
                if (selectedNpsValue >= 4 && typeof window.showRAAward === 'function') {
                    window.showRAAward();
                }
            } else {
                alert('Ocorreu um erro ao enviar sua avaliação. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao enviar:', error);
            alert('Erro de conexão. Verifique sua internet e tente novamente.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Enviar Avaliação';
            showLoading(false);
        }
    });
});
