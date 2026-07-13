# Testing Plan

## Automated checks

- TypeScript compilation through production build.
- Linting through the project lint command.
- Unit tests for deterministic mock calculations, account limits, and local-storage helpers.
- Component tests for critical interactive controls where practical.

## Manual QA

- Desktop, tablet, and mobile responsive passes.
- Keyboard navigation for nav, buttons, tabs, forms, menus, and dialogs.
- Color contrast checks on dark backgrounds.
- Free and Premium account switching.
- Local storage persistence for auth, watchlist, and feedback.
- Demonstration notices visible on pages with market data or scenarios.

## Data integrity

- Confirm no live broker, payment, market feed, or production auth integration exists.
- Confirm all investment values are mock and labelled as demonstration data.
- Confirm scenario values are deterministic, not random per render.

## Release readiness

- `lint` passes.
- `test` passes.
- Production build passes.
- README includes setup and startup steps.
- `.env.example` contains only placeholder values.
