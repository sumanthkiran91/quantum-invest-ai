# Quantum Invest AI

Quantum Invest AI is an interactive prototype for a global AI investment intelligence platform. It helps testers explore demonstration markets, save local watchlists, review AI-style educational insights, compare mock investment scenarios, and submit local feedback.

## Prototype status

This is a friends-and-family testing prototype. It uses local browser storage and mock data only.

- No live market feeds
- No real broker connections
- No production authentication
- No payment processing
- No real-money trading
- No financial advice or guaranteed investment predictions

## Demo accounts

Free account:

```text
email: free@test.com
password: Demo123!
```

Premium account:

```text
email: premium@test.com
password: Demo123!
```

## Main pages

- `/` Global Dashboard
- `/watchlist` Watchlist Dashboard
- `/investments/NVDA` reusable Investment Details example
- `/login` local prototype login
- `/register` local prototype registration
- `/forgot-password` forgotten-password demo
- `/upgrade` upgrade flow demo with no payment processing
- `/feedback-admin` local feedback viewer

## Local startup

The easiest Windows preview command is:

```bat
start-local-preview.cmd
```

Keep that window open while testing, then open:

```text
http://127.0.0.1:3000
```

## Development commands

This project uses pnpm. In this Codex workspace, pnpm is bootstrapped under `work/`.

```bash
pnpm install
pnpm dev
pnpm lint
pnpm test
pnpm build
```

If using the bundled runtime in this workspace, use the existing local starter or run commands through the bundled Node setup already configured here.

## Feedback testing

A Feedback button appears on every page. Feedback is stored in local browser storage only. Review it at:

```text
/feedback-admin
```

The feedback form includes tester consent, demonstration-data notice, and prototype privacy notice.

## Environment variables

Copy `.env.example` if needed. Do not commit `.env` or `.env.local` files.

```bash
cp .env.example .env.local
```

No secrets are required for the current prototype.

## GitHub push steps

1. Create a new empty GitHub repository.
2. In this project folder, confirm checks pass:

```bash
pnpm lint
pnpm test
pnpm build
```

3. Add the GitHub remote:

```bash
git remote add origin https://github.com/YOUR-USERNAME/quantum-invest-ai.git
```

4. Push the repository:

```bash
git branch -M main
git add .
git commit -m "Prepare Quantum Invest AI prototype"
git push -u origin main
```

## Vercel import and deployment

1. Go to Vercel and choose Add New Project.
2. Import the GitHub repository.
3. Framework preset: Next.js.
4. Build command: `pnpm build`.
5. Install command: `pnpm install`.
6. Output directory: leave default.
7. Environment variables: none required. Optional public prototype flags are listed in `.env.example`.
8. Click Deploy.
9. Open the generated Vercel preview URL and confirm the app loads before sharing it with testers.

Do not claim deployment succeeded until the public Vercel URL loads successfully.
