# Quantum Invest AI Design System

## Visual direction

- Premium financial dashboard, not a generic SaaS template.
- Dark navy and black application background.
- Rounded cards with subtle borders, soft shadows, and restrained glow states.
- Purple and blue identify AI and Premium features.
- Green indicates positive movement.
- Red indicates negative movement.
- Typography should be compact, consistent, and readable on desktop, tablet, and mobile.

## Colors

- Background: `#050814`, `#080D1C`, `#0B1020`
- Surface: `#10182B`, `#131C33`
- Border: `rgba(148, 163, 184, 0.18)`
- Primary blue: `#38BDF8`
- AI purple: `#A78BFA`
- Premium violet: `#7C3AED`
- Positive green: `#22C55E`
- Negative red: `#EF4444`
- Text primary: `#F8FAFC`
- Text secondary: `#CBD5E1`
- Text muted: `#64748B`

## Components

- `AppShell`: shared layout with navigation, badge area, profile area, and responsive content frame.
- `TopNavigation`: primary destinations, global search, notifications, and account badge.
- `Card`: rounded module container with accessible heading support.
- `Badge`: plan, status, market, and feature labels.
- `Button`: clear focus states, disabled states, and icon support.
- `DemoNotice`: persistent demonstration-data reminder.

## Interaction and accessibility

- Buttons, menus, tabs, inputs, and tooltips must be keyboard accessible.
- Keep visible focus outlines on interactive controls.
- Use plain labels such as "Practice with Virtual Money" instead of trading jargon.
- Financial terms should receive tooltips on detailed pages.
- Maintain sufficient contrast for dark surfaces.

## Layout rules

- Desktop: dense grid with top navigation and right-side context modules.
- Tablet: two-column layout where possible, with navigation wrapping cleanly.
- Mobile: single-column layout, compact navigation, cards stacked with stable spacing.
- Avoid large decorative graphs in the Global Dashboard market overview.
