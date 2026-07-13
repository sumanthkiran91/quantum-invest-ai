# AGENTS.md

## Project rules

- Work inside this project folder unless the user explicitly authorizes another location.
- Use mock demonstration data only.
- Do not connect real brokers, market feeds, payment systems, production authentication, or real-money trading.
- Do not claim investment outcomes are guaranteed.
- Keep beginner-friendly wording throughout the prototype.
- Preserve supplied dashboard references; do not turn the app into a generic template.
- Keep implementation phases ordered: foundation first, then dashboards, watchlist, details, auth, feedback, and deployment.

## Design requirements

- Use dark navy and black backgrounds.
- Create a premium financial-dashboard appearance with rounded cards, subtle borders, and soft shadows.
- Use purple and blue for AI and Premium features.
- Use green for positive movement and red for negative movement.
- Maintain consistent spacing, typography, and responsive behavior across desktop, tablet, and mobile.
- Build accessible buttons, forms, tooltips, navigation, tabs, and menus.
- Use reusable React components and shared data helpers.

## Technical standards

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Reusable components under `src/components`.
- Mock data and deterministic helpers under `src/lib`.
- Tests for business rules and deterministic calculations as features are added.
- Run lint, tests, and production build before reporting completion.

## Reference assets

- Design references are supplied from `D:\Personal\AI Trading Project\design-references`.
- Current inspected reference: `Dashboard-Images.png`, 1536 x 1024.
