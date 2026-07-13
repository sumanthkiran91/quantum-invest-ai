# Quantum Invest AI Product Requirements

## Product vision

Quantum Invest AI is an interactive prototype for a global AI investment intelligence platform. It helps beginner and intermediate users explore markets, understand demonstration investment data, save watchlists, compare educational scenarios, and provide feedback during testing.

## Prototype boundaries

- Use mock demonstration data only.
- Do not connect real brokers, live market feeds, payment systems, production authentication, or real-money trading.
- Do not provide guaranteed buy, sell, or hold instructions.
- Clearly label educational estimates, delayed alerts, virtual investing, and premium states.

## Target users

- New investors who need plain-English explanations.
- Existing investors who want a faster global overview.
- Friends-and-family testers validating product clarity and value.

## Core product areas

- Global Dashboard for market overview, industry exploration, market timing, movers, watchlist preview, AI suggestions, news, and premium prompts.
- Watchlist Dashboard for saved demo assets with local persistence, filters, sorting, and Free/Premium limits.
- Reusable Investment Details page for stocks, crypto, ETFs, and commodities.
- Local prototype authentication with Free and Premium demo accounts.
- Feedback and issue reporting with local admin-style review.

## Success criteria

- Users understand that all values are demonstration data.
- First-time users can navigate to dashboard, watchlist, and investment details without instruction text blocks.
- Free and Premium differences are visible without feeling punitive.
- The app builds cleanly, passes linting, and is ready for Vercel preview deployment.

## Reference inspection

The supplied image folder contains one dashboard composite:

- `Dashboard-Images.png`, 1536 x 1024, RGB.

The implementation should preserve a premium financial-dashboard direction: dark navy/black surfaces, dense but readable market modules, rounded cards, compact top navigation, subtle borders, and blue/purple AI or Premium accents.
