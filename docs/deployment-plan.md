# Deployment Plan

## Hosting target

Use Vercel for preview deployment after local build checks pass and the user authenticates and authorizes deployment.

## Configuration

- Framework: Next.js App Router.
- Build command: `pnpm build`.
- Install command: `pnpm install`.
- Output directory: Vercel default.
- Required secrets: none for the prototype.
- Optional public prototype flags are documented in `.env.example`.

## GitHub push steps

1. Create an empty GitHub repository.
2. Confirm `lint`, `test`, and `build` pass locally.
3. Run `git remote add origin https://github.com/YOUR-USERNAME/quantum-invest-ai.git`.
4. Run `git branch -M main`.
5. Run `git add .`.
6. Run `git commit -m "Prepare Quantum Invest AI prototype"`.
7. Run `git push -u origin main`.

## Vercel import steps

1. Open Vercel.
2. Select Add New Project.
3. Import the GitHub repository.
4. Confirm the Next.js preset.
5. Confirm `pnpm install` and `pnpm build`.
6. Deploy.
7. Open the public preview URL and confirm it loads before sharing.

## Security guardrails

- Do not commit `.env`, `.env.local`, API keys or secrets.
- Do not add real broker, payment, auth or live market integrations.
- Keep tester feedback local unless a backend is explicitly approved later.
- Do not claim deployment succeeded unless the public URL loads successfully.
