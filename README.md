# Kusum — Portfolio

A single-page personal portfolio built with **HTML, CSS and vanilla JavaScript**. No frameworks, no libraries, no build step, no server.

## How to run it

Double-click `index.html`.

That is the whole instruction. There is nothing to install, nothing to compile, and no internet connection required. The site itself is three files, and the browser opens it directly from disk.

## What is on the page

The site is one scrolling page with five sections plus a header and footer.

| Section | What it contains |
|---|---|
| **Hero** | Name, an animated headline, a short introduction, and key facts (city, degree, graduation year) |
| **01 About** | How I got into programming, why backend, and a facts table |
| **02 Skills** | Languages, backend, and tools — grouped as tags rather than progress bars |
| **03 Learning** | Where I currently am: Java, Spring Boot, SQL & databases, and this site. Filterable by area |
| **04 Journey** | Education timeline, 2022 to 2028 |
| **05 Contact** | A validated contact form and links to email, GitHub and LinkedIn |

## File structure

```
portfolio/
├── index.html      The whole page: markup and content
├── css/
│   └── style.css   All styling, in 16 numbered sections
├── js/
│   └── script.js   All behaviour, in 9 numbered sections
├── preview.png     1200x630 share card, read by link unfurlers only
└── README.md       This file
```

**`index.html`** — every section is a `<section>` element with an `id`. The navigation is just a list of links pointing at those ids, which is all that "one-page website" navigation really is.

**`css/style.css`** — read top to bottom; it runs from the most general ideas (colour and type variables) down to individual sections. Section 1 holds the design tokens, and section 16 holds the four media queries.

**`js/script.js`** — nine small features, each in a labelled section. The whole file sits inside one IIFE, so it adds **zero** names to the global `window` object.

## The JavaScript

| # | Feature | What it demonstrates |
|---|---|---|
| 01 | Theme toggle | Remembering a choice in `localStorage`, and switching `data-theme` on `<html>` |
| 02 | Mobile navigation | `classList.toggle` and keeping `aria-expanded` truthful |
| 03 | Copyright year | `new Date()` and looping over elements |
| 04 | Typing headline | A three-state loop (typing / pausing / deleting) using `setTimeout` |
| 05 | Scroll reveal | `IntersectionObserver`, un-observing after the first fire |
| 06 | Card filtering | **Event delegation** — one listener on the filter bar, not one per button |
| 07 | Scroll-spy navigation | `IntersectionObserver` with a `rootMargin` band in the middle of the screen |
| 08 | Back-to-top button | A `scroll` listener and `window.scrollTo({ behavior })` |
| 09 | Form validation | Regex matching, `preventDefault()`, and `aria-invalid` |

The functions that do something non-obvious carry a short JSDoc comment explaining what they take and what they return, and each of the nine features opens with a labelled section comment.

## Technical decisions

**Why no framework?** The brief is HTML, CSS and a little JavaScript. Everything here is explainable line by line without a build chain, and the site loads instantly because there is nothing to download.

**Why are the colours all variables?** Only section 1 of the stylesheet contains raw colour values. Every other rule uses `var(--terracotta)` or `var(--ink)`. That is why dark mode is roughly fifteen lines — it redefines the tokens rather than restyling every component.

**Why tags instead of skill progress bars?** A progress bar implies a percentage that nobody can justify. A list of things I would happily be asked about is more honest and harder to challenge.

**Why is there only one image?** Every visual on the page is a CSS gradient, a border, or a Unicode character. The single file, `preview.png` (1200×630), exists only for link previews — WhatsApp, LinkedIn and Slack read it when the URL is shared. Nothing on the page loads it, so the site is unaffected if it is deleted; the share card just loses its picture.

## Accessibility

- A "skip to content" link for keyboard users, hidden until focused
- Visible focus outlines on every interactive element (`:focus-visible`)
- Every form input has a `<label>` tied to it by `for`/`id`
- The mobile menu button reports its state with `aria-expanded`
- The current section is marked with `aria-current`
- Error messages are announced via `aria-live`, and `aria-invalid` is set on the failing field
- Every animation is disabled when the visitor has asked for reduced motion
- Colour contrast is designed to meet WCAG AA in both light and dark themes

## Browser support

Written for modern browsers — Chrome/Edge 88+, Firefox 89+, Safari 15.4+. It relies on CSS custom properties, `clamp()`, `aspect-ratio`, `:focus-visible` and `IntersectionObserver`, none of which exist in Internet Explorer.

## Known limitations

**The contact form does not send anything.** There is no backend and no server, so on submit it validates the input and then shows a confirmation message. The page says this plainly rather than pretending otherwise — see the note under the "Elsewhere" panel.

**The theme choice is stored per browser.** Clearing site data resets it.

**Nothing is loaded from the internet.** There is one optional Google Fonts line in `<head>`, left commented out. Uncomment it for a nicer display font; the site works without it and falls back to a system serif.

## Author

Kusum — MCA student, Chandigarh University (Mohali).
First year, graduating 2028. Focused on backend development with Java and Spring Boot.
