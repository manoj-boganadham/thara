# Tharuni & Rahul Wedding Invitation

An interactive single-page wedding invitation built with React and Vite.

The experience includes an animated day/night hero scene, a live countdown to the wedding, and quick venue navigation links through Google Maps.

## Features

- Interactive day-cycle hero with draggable sun/moon and dynamic theme colors.
- Live wedding countdown that updates every second.
- Event cards for wedding and reception with one-click maps links.
- Scroll-based reveal animations and responsive layout for mobile and desktop.

## Tech Stack

- React 19
- Vite 8
- JavaScript (JSX)
- CSS (custom styles with variables and media queries)
- ESLint 9 (flat config with React hooks and refresh plugins)

## Getting Started

### Prerequisites

- Node.js
- npm

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Lint

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```text
.
├── index.html
├── src
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── components
│       ├── Countdown.jsx
│       ├── DayCycleScene.jsx
│       ├── EventCard.jsx
│       └── Hero.jsx
├── eslint.config.js
└── vite.config.js
```

## Customization

- Update event details (date, time, venue, maps query) in `src/App.jsx`.
- Update countdown target date in `src/components/Countdown.jsx`.
- Tweak day/night scene behavior and theme transitions in `src/components/DayCycleScene.jsx`.
- Adjust layout and typography in `src/App.css` and `src/index.css`.

## Deployment

Build the app with `npm run build` and deploy the generated `dist/` folder to any static host (for example, Vercel or Netlify).

If you use social previews, make sure the `og:image` URL configured in `index.html` points to a valid image for your deployed domain.
