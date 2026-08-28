(function() {
    'use strict';

    const CDN_URL = 'https://cristianobrito.github.io/Codex-cdn/conteudo.json';

    async function carregarCodex() {
        try {
            const resposta = await fetch(CDN_URL + '?v=' + Date.now());
            if (!resposta.ok) throw new Error('Erro ao buscar CDN: ' + resposta.status);
            
            const dados = await resposta.json();
            console.log(`[Codex-CDN] Versão ${dados.versao} carregada com sucesso!`);
            
            renderizarNaPagina(dados.base_conhecimento);
        } catch (erro) {
            console.error('[Codex-CDN] Falha:', erro);
        }
    }

    function renderizarNaPagina(itens) {
        // Cria um container visual na página para exibir os dados do CDN
        let container = document.getElementById('codex-visor');
        if (!container) {
            container = document.createElement('div');
            container.id = 'codex-visor';
            container.style.cssText = `
                position: fixed; bottom: 15px; right: 15px; 
                background: #1e1e2e; color: #cdd6f4; padding: 15px; 
                border-radius: 8px; font-family: monospace; font-size: 12px;
                z-index: 99999; max-width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                border: 1px solid #89b4fa;
            `;
            document.body.appendChild(container);
        }

        let html = '<b style="color: #89b4fa;">📚 Codex CDN Ativo</b><hr style="border-color: #313244; margin: 8px 0;">';
        itens.forEach(item => {
            html += `<div style="margin-bottom: 6px;">
                <span style="color: #f38ba8;">[${item.termo}]</span> ${item.descricao}
            </div>`;
        });

        container.innerHTML = html;
    }

    // Executa assim que o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', carregarCodex);
    } else {
        carregarCodex();
    }
})();
