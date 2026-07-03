---
name: VacationTLV
rarity: LEGENDARY
blurb: Reservation, payment and availability system for short-term rentals
progress: 90
order: 4
stack:
  - Next.js
  - TypeScript
  - PostgreSQL
  - Guesty API
  - Sumit API
  - Vercel
# liveUrl: https://vacationtelaviv.com
# repoUrl: https://github.com/yoavv2/vacationtlv
# image: /missions/vacation-tlv.png
---

## OBJECTIVE

Short-term rental booking looks simple from the outside: pick dates, pay, get a
confirmation. In practice, the flow depends on multiple systems agreeing on
availability, price, currency, reservation state, and payment status.

VacationTLV was built as a full-stack case study for that exact problem.

## EXECUTION

- Guest selects dates and starts a booking flow for a Tel Aviv rental.
- Backend validates availability and quote data before payment is allowed.
- Payment flow checks amount and currency against the server-side quote.
- Reservation creation is handled through Guesty API boundaries.
- Booking state is designed to stay visible instead of failing silently.
- Provider-specific logic is isolated so payment and reservation contracts do
  not leak into the UI.

## FIELD NOTES

The main engineering challenge was consistency across external systems. Payment,
reservation, availability, and UI status cannot be treated as separate features.
They are one transactional guest experience.

The project forced careful thinking around idempotency, expired quotes, partial
failure, provider errors, environment configuration, and auditability.

## OUTCOME

Private work-in-progress case study. Built to demonstrate real product
engineering: external API integration, payment-aware backend logic, booking
state management, and production deployment constraints.