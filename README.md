# Kanban Board

A Kanban board built with **React**, **TypeScript**, and **Vite**. Create tasks, drag and drop cards between columns, tag them, and edit or delete them — all persisted locally in the browser via `localStorage`.

**Live demo:** https://chnmtl.github.io/kanban-board/

## Features

- Drag and drop cards between columns, and reorder within a column
- Create, edit and delete tasks, each with up to three colour-coded tags
- Board state persisted in `localStorage` (no account or server needed)
- Chalkboard theme, with a whiteboard light mode
- Built with MUI components

The three columns (To Do, In Progress, Completed) are fixed; adding and
renaming columns isn't supported yet.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, MUI, `@hello-pangea/dnd`

## Getting Started

### Prerequisites

- Node.js 20+

### Run locally

```bash
cd client
npm install
npm run dev
```

### Build

```bash
cd client
npm run build      # output in client/dist
npm run preview    # serve the production build locally
```

## Deployment

Pushing to `main` triggers the [GitHub Pages workflow](.github/workflows/deploy.yml),
which builds `client/` and publishes `client/dist`. Because the site is served
from the `/kanban-board/` subpath, Vite's `base` is set accordingly in
`client/vite.config.ts` — keep the two in sync if the repo is ever renamed.

## License

This project is licensed under the [Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)](https://creativecommons.org/licenses/by-nc-nd/4.0/).

You may view and share this project for non-commercial purposes, but you may not modify, redistribute, or claim it as your own.
