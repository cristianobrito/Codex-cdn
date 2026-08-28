(function() {
    'use strict';

    const CDN_URL = 'https://cristianobrito.github.io/Codex-cdn/conteudo.json';
    let cacheDados = [];

    async function carregarCodex() {
        try {
            const resposta = await fetch(CDN_URL + '?v=' + Date.now());
            if (!resposta.ok) throw new Error('Erro ao buscar CDN: ' + resposta.status);
            
            const dados = await resposta.json();
            cacheDados = dados.base_conhecimento || [];
            renderizarNaPagina(cacheDados);
        } catch (erro) {
            console.error('[Codex-CDN] Falha:', erro);
        }
    }

    function renderizarNaPagina(itens) {
        let container = document.getElementById('codex-visor');
        if (!container) {
            container = document.createElement('div');
            container.id = 'codex-visor';
            container.style.cssText = `
                position: fixed; bottom: 15px; right: 15px; 
                background: #1e1e2e; color: #cdd6f4; padding: 15px; 
                border-radius: 8px; font-family: monospace; font-size: 12px;
                z-index: 99999; width: 320px; box-shadow: 0 4px 12px rgba(0,0,0,0.5);
                border: 1px solid #89b4fa;
            `;
            document.body.appendChild(container);
        }

        container.innerHTML = `
            <b style="color: #89b4fa;">📚 Codex CDN Ativo</b>
            <hr style="border-color: #313244; margin: 8px 0 10px 0;">
            <input type="text" id="codex-busca" placeholder="Pesquisar termo..." style="
                width: 100%; box-sizing: border-box; background: #11111b; color: #cdd6f4;
                border: 1px solid #45475a; padding: 6px 8px; border-radius: 4px; font-size: 12px;
                outline: none; margin-bottom: 10px;
            ">
            <div id="codex-resultados" style="max-height: 180px; overflow-y: auto;"></div>
        `;

        const inputBusca = document.getElementById('codex-busca');
        inputBusca.addEventListener('input', (e) => {
            const termoBusca = e.target.value.toLowerCase();
            const filtrados = cacheDados.filter(item => 
                item.termo.toLowerCase().includes(termoBusca) || 
                item.descricao.toLowerCase().includes(termoBusca)
            );
            atualizarListaResultados(filtrados);
        });

        atualizarListaResultados(itens);
    }

    function atualizarListaResultados(itens) {
        const divResultados = document.getElementById('codex-resultados');
        if (!divResultados) return;

        if (itens.length === 0) {
            divResultados.innerHTML = '<div style="color: #f38ba8; font-style: italic;">Nenhum resultado encontrado.</div>';
            return;
        }

        let html = '';
        itens.forEach(item => {
            html += `<div style="margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid #313244;">
                <span style="color: #f38ba8; font-weight: bold;">[${item.termo}]</span> 
                <span style="color: #bac2de;">${item.descricao}</span>
            </div>`;
        });
        divResultados.innerHTML = html;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', carregarCodex);
    } else {
        carregarCodex();
    }
})();
