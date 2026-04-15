# Gulp starter

## Commands

- `npm run dev` — development build into `build/`
- `npm run build` — production/docs build into `docs/`
- `npm run fonts:dev` — regenerate fonts and `src/scss/base/_fontsAutoGen.scss` for dev
- `npm run fonts:docs` — regenerate fonts and `src/scss/base/_fontsAutoGen.scss` for docs

## First things to change for every new website

1. `src/html/index.html` — `lang`, `title`, `description`, starter content
2. `src/scss/base/_vars.scss` — container, breakpoints, fonts, colors
3. `src/scss/main.scss` — decide whether `@import './base/docs';` is needed
4. `src/html/blocks/*` — header, footer, mobile nav
5. `src/js/index.js` — keep only the libraries/modules that the project actually uses
6. `src/fonts/` — add project fonts, then run one of the font commands

## Where the main settings live

- HTML includes: `src/html/blocks/`
- SCSS base: `src/scss/base/`
- SCSS blocks: `src/scss/blocks/`
- JavaScript entry: `src/js/index.js`
- Mobile nav logic: `src/js/modules/mobile-nav.js`
- Gulp tasks: `gulp/`
