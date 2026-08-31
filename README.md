# Storymaker — Portfólio & Proposta Comercial

Aplicação React (Vite) que funciona como **portfólio de vídeos de casamento + proposta comercial editável**,
para a marca *Storymaker*.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Como funciona

- **Modo visualização**: mostra o portfólio como o cliente vai ver.
- **Editar proposta** (barra superior): ativa o modo de edição. Todo texto, preço, vídeo, experiência e
  depoimento vira editável diretamente na página. Nada é salvo até clicar em **Salvar alterações**
  (ou descartado ao clicar em **Cancelar**).
- **Duplicar proposta**: cria uma cópia independente da proposta atual (a *Proposta Base* nunca é alterada).
  Use para criar uma proposta personalizada por casal — ative "proposta personalizada" na capa (seção Hero)
  para mostrar os nomes do casal, data e local.
- **Visualizar como cliente**: esconde toda a interface administrativa, mostrando exatamente o que o
  casal vai ver.
- **Baixar / Salvar em PDF**: usa a função de impressão do navegador (`Ctrl/Cmd + P`) com um layout de
  impressão dedicado (sem botões administrativos).
- **Seções da página**: no modo de edição, é possível reordenar ou ocultar seções inteiras (capa, sobre,
  portfólio, experiências, comparação, tempo real, como funciona, depoimentos, contato).

## Armazenamento

Todas as propostas ficam salvas no `localStorage` do navegador (`src/utils/storage.js`), separadas por
proposta (`base` + cada proposta duplicada). A estrutura de dados (`src/data/portfolioData.js`) foi pensada
para futuramente ser substituída por chamadas a uma API/banco de dados sem alterar os componentes.

## Estrutura

```
src/
├── components/     Componentes de UI reutilizáveis
├── pages/          Portfolio.jsx — página única que monta as seções
├── data/           Estrutura de dados padrão (Proposta Base)
├── hooks/          usePortfolio.js — toda a lógica de estado/CRUD/persistência
├── utils/          storage.js (localStorage) e whatsapp.js (link do WhatsApp)
├── App.jsx
└── main.jsx
```

## Vídeos

Cada vídeo aceita um link do YouTube, Vimeo ou um arquivo direto (`.mp4`/`.webm`/`.mov`). O player abre em
um modal dentro da própria página — o cliente nunca precisa sair do site.
# portifolio_vb_videomaker
