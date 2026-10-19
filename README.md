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

## Link compartilhável para o cliente

O botão **Visualizar como cliente** continua sendo apenas uma prévia local.
O botão **Gerar link para cliente** publica a proposta no Supabase e gera uma URL pública no formato:

```text
https://ballmannjulia.github.io/portifolio_vb_videomaker/?share=IDENTIFICADOR
```

### Configuração necessária (uma vez)

1. Crie um projeto gratuito no Supabase.
2. No SQL Editor do Supabase, execute o arquivo `supabase_setup.sql` deste projeto.
3. Em **Project Settings > API**, copie a URL do projeto e a chave pública/anon.
4. Na raiz do projeto, crie `.env.local` com:

```env
VITE_SUPABASE_URL=https://SEU_PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_PUBLICA
VITE_SUPABASE_BUCKET=portfolio-media
VITE_PUBLIC_SITE_URL=https://ballmannjulia.github.io/portifolio_vb_videomaker/
```

5. No GitHub, abra **Settings > Secrets and variables > Actions** e crie os secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_SUPABASE_BUCKET` com valor `portfolio-media`

Depois de publicar a atualização no GitHub, o mesmo link funcionará em celular ou computador sem depender do navegador da administradora.

## Vídeos

Para upload pelo editor, use preferencialmente **MP4 codificado em H.264/AAC** ou **WebM**. Arquivos MOV podem abrir em alguns dispositivos e falhar em outros, especialmente no Chrome.

Quando o Supabase está configurado, vídeos, capas e fotos enviados pelo editor são enviados para o bucket público `portfolio-media`. Sem Supabase, eles continuam salvos apenas no navegador para testes locais e não podem ser enviados ao cliente por link.
