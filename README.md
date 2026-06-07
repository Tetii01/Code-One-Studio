# Code One Studio

Site de prezentare (one-page) pentru **Code One Studio** — barbershop premium în Sibiu.

Site static, fără dependențe și fără build — doar HTML, CSS și JavaScript.

## Structură

```
index.html            # pagina principală
assets/styles.css     # stiluri
assets/app.js         # interacțiuni (galerie, lightbox, modal programare)
assets/logo_symbol.png
assets/img/           # fotografii lucrări + interior
assets/video/         # clipuri (hero + galerie)
```

## Rulare locală

```bash
python3 -m http.server 8000
# deschide http://localhost:8000/
```

## Funcționalități

- Hero cu video în fundal (loop, fără sunet) și rating Google
- Servicii cu prețuri, galerie masonry (foto + video) cu lightbox
- Echipă, hartă Google, program de lucru (ziua curentă evidențiată)
- Modal de programare: frizer → serviciu → dată → oră, cu trimitere pe WhatsApp
- Complet responsive (telefon + desktop)

## Deploy

Fiind static, poate fi publicat direct pe orice hosting: GitHub Pages, Netlify,
Vercel, Cloudflare Pages sau orice server web clasic.
