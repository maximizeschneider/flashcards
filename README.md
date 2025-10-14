# Flashcards

A study companion built with Next.js 14, Tailwind CSS, shadcn/ui components, and Convex. Create decks, capture cards, and let the built-in spaced repetition scheduler surface due reviews just like Anki.

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set the Convex deployment URL:

   ```bash
   cp .env.example .env.local
   # Edit NEXT_PUBLIC_CONVEX_URL with the URL from your Convex dashboard
   ```

3. Start the development servers:

   ```bash
   npm run dev
   ```

   The Next.js app runs on [http://localhost:3000](http://localhost:3000). Convex functions are picked up automatically when you run `npx convex dev` in another terminal.

## Project structure

- `app/` – App Router pages and providers for Convex and global UI concerns.
- `components/` – shadcn/ui primitives plus deck, flashcard, and review-specific components.
- `convex/` – Database schema and backend functions that power deck management, card CRUD, and spaced repetition scheduling.
- `lib/` – Shared utilities, including Tailwind class name helpers.

## Available scripts

| Script        | Description                             |
| ------------- | --------------------------------------- |
| `npm run dev` | Run Next.js in development mode.        |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Serve the production build locally.   |
| `npm run lint` | Run ESLint with the Next.js config.    |

## Styling

Tailwind CSS is configured with CSS variables for light/dark theming. shadcn/ui components live under `components/ui` and can be extended with the [shadcn UI CLI](https://ui.shadcn.com/docs/installation/next).

## Convex

Convex stores decks, cards, and the scheduling metadata that powers the spaced repetition system. Use the Convex CLI to generate types and run the backend locally:

```bash
npx convex dev
```

This will watch the `convex/` directory, sync schema changes, and generate `_generated` TypeScript helpers for stronger typing.
