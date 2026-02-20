document.addEventListener('DOMContentLoaded', function () {
    const RA_Award = document.getElementById('RA-award');
    
    // Função para mostrar o popup de premiação
    window.showRAAward = function() {
        if (!RA_Award) return;
        
        // Estrutura HTML do Popup (Gerada dinamicamente para garantir consistência)
        RA_Award.innerHTML = `
            <div id="overlay"></div>
            <div id="popup" role="dialog" aria-labelledby="popup-title" aria-modal="true">
                <button class="pop-close" id="close-popup" aria-label="Fechar">&times;</button>
                <div class="pop-top">
                    <span class="logo"></span>
                    <span class="separator"></span>
                    <span class="award"></span>
                </div>
                <div id="popup-content">
                    <div class="pop-images">
                        <div class="ag-logo"></div>
                    </div>
                    <h2 class="pop-h2" id="popup-title">Estamos concorrendo ao Prêmio RA 2025!</h2>
                    <p class="pop-h3">Casas de Apostas (Bets) - Megaoperações</p>
                    <a href="https://www.reclameaqui.com.br/premio/votacao/apostas/casas-de-apostas-bets-megaoperacoes/" 
                       target="_blank" 
                       class="vote-btn" 
                       rel="noopener noreferrer">
                        Votar agora!
                    </a>
                </div>
            </div>
        `;
        
        RA_Award.classList.remove('hidden');
        
        // Evento de Fechar
        document.getElementById('close-popup').addEventListener('click', () => {
            RA_Award.classList.add('hidden');
        });
        
        document.getElementById('overlay').addEventListener('click', () => {
            RA_Award.classList.add('hidden');
        });
    };
});
