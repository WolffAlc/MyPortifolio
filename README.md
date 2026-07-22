# Portfólio · Wolfgang Carneiro

Portfólio de desenvolvedor em **React + TypeScript** com **CSS puro** (`App.module.css`),
tema **Dark (padrão)** / **Light**, estética "IDE + gamer sóbrio", 100% responsivo (testado até 320px).

## Stack
- **React 18 + TypeScript** (arquitetura single-file em `src/App.tsx`)
- **CSS puro** via CSS Modules (`src/App.module.css`) — sem Tailwind/Bootstrap
- **Boxicons** (via CDN no `index.html`)
- **AOS** (animações de scroll)
- **Notyf** (feedback do formulário)

## Rodando o projeto
```bash
npm install
npm run dev        # ambiente de desenvolvimento
npm run build      # build de produção (tsc + vite)
npm run preview    # pré-visualiza o build
```

## O que você deve trocar (placeholders)
Tudo está centralizado e comentado no topo do `src/App.tsx`:

1. **Foto** — já incluída em `public/person.png`. Para trocar, substitua o arquivo.
2. **Projetos** — array `PROJECTS`:
   - `image`: hoje aponta para o Unsplash. Coloque seus prints em `public/` e use `"/img/seuprint.png"`.
   - `deployUrl` e `gitUrl`: estão como `'#'` (marcados com `// TODO`). Cole os links reais.
3. **Redes sociais** — links `github.com` / `linkedin.com` no Drawer e no Footer.
4. **Formulário** — em `Contact`, o envio é simulado (`setTimeout`).
   Conecte seu backend, **EmailJS** ou **Formspree** no ponto indicado por comentário.

## Estrutura
```
├── index.html            # CDN do Boxicons + meta tags
├── public/
│   └── person.png        # sua foto
└── src/
    ├── main.tsx          # entrada React
    ├── App.tsx           # TODA a aplicação (componentes + lógica)
    ├── App.module.css    # TODO o estilo (temas, responsividade)
    └── vite-env.d.ts     # tipos do Vite + CSS Modules
```

## Detalhes de qualidade
- `overflow-x: hidden` no `body`, `#root` e `.app` (sem rolagem lateral no mobile).
- Menu mobile (drawer) com overlay, trava de scroll, fechamento por ESC e por clique.
- Foco visível acessível, `prefers-reduced-motion` respeitado, `aria-label` nos controles.
- TypeScript estrito (`strict: true`, sem `any`, sem variáveis não usadas) — compila limpo.