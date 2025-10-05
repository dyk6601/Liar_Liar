# Liar Liar

A small multiplayer party game web app built with React. Players join a room, pick nicknames, and play a social deduction-style game where one player is the liar and others try to spot them.

This repository contains the frontend for the game, implemented with Create React App and a small set of custom components and utilities.

## Features

- Create or join a room using a short room code.
- Pick a nickname before entering the game.
- Host controls to start the game and manage rounds.
- Simple modal-based UI for nickname entry, rules, and room actions.
- Lightweight UI components: buttons, inputs, icons, and modals.

## Tech stack

- React 19 (Create React App)
- Tailwind-like utility classes for quick styling (project uses utility class names in JSX)
- Optional: Supabase utils are included in `src/utils/supabase.js` for backend integration

## Project structure (important files)

- `src/App.js` — main app container.
- `src/index.js` — React entrypoint.
- `src/components/` — UI components used across the app:
	- `NicknameModal.jsx` — modal to choose nickname and enter room code.
	- `RulesModal.jsx` — displays game rules.
	- `modal.jsx`, `input.jsx`, `button.jsx`, `icons.jsx` — small reusable components.
- `src/data/categories.js` — sample data for in-game categories.
- `src/utils/helper.js` — utility helper functions.
- `src/utils/supabase.js` — (optional) supabase setup for realtime/DB.

## Running locally

Prerequisites: Node.js 18+ and npm.

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

## Notes for further work

- Backend: integrate Supabase (or another realtime backend) to manage rooms, players, and game state.
- Validation: improve form validation and show helpful error messages.
- Styling: wire Tailwind or a CSS framework for consistent styling. Right now the project uses utility-like class names in components.
- Tests: add unit and integration tests for components and game logic.

## Contributing

Contributions welcome. Open issues or PRs for features or bug fixes.

## License

This project is provided as-is. Add a LICENSE file if you plan to open-source it.

