# 🕯️ The Halloweeners — RSVP Portal

> _An invitation is not sent. It is summoned._

A ceremonial, token-gated RSVP site for **The Halloweeners** — no accounts, no passwords, just a personal invite link tied to your name.

Live at [halloweeners.se](https://halloweeners.se).

## ✨ Features

- **Token-based guest access** — each guest gets a unique, auto-generated token (see [Token generation](#-token-generation) below). Visiting `/api/token?token=...` sets an `invite_token` cookie and unlocks the site for 45 days; there's also a form-based entry path for guests typing their token directly.
- **RSVP with a twist** — guests confirm attendance, indicate a plus-one, and answer an in-theme cipher as part of the RSVP flow.
- **Confirmation emails** — sent via Resend from `spirits@halloweeners.se` (or whatever domain you configure in Resend) once an RSVP is recorded with an email address, built as a React Email component (`emails/halloweeners.tsx`) rather than raw HTML.
- **Calendar download** — `/api/calendar?token=...` serves an `.ics` file so guests can drop the night straight into their calendar. Requires a valid guest token as a query param — each guest's confirmation email links to this with their own token baked in.
- **Admin panel** — a token flagged `is_admin` (or listed in `ADMIN_GUEST_TOKENS`) unlocks `/admin`, with tabs for inviting/removing guests, reviewing RSVPs, and registering prize winners against the guest list.
- **Automated tests** — Vitest for pure logic (token validation, date formatting, `BoldText` parsing), Playwright for end-to-end flows (auth, RSVP submission, admin access control), both wired into the build (see [Testing](#-testing)).

## 🛠️ Tech Stack

| Layer     | Technology                                                                         |
| --------- | ---------------------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) + React 19                          |
| Hosting   | [Vercel](https://vercel.com/)                                                      |
| Database  | [Neon](https://neon.tech/) Postgres, via `@neondatabase/serverless`                |
| Email     | [Resend](https://resend.com/) + `@react-email/components`                          |
| Styling   | Tailwind CSS 4                                                                     |
| Auth      | Custom token-based cookie auth (no third-party auth provider)                      |
| Testing   | [Vitest](https://vitest.dev/) (unit) + [Playwright](https://playwright.dev/) (E2E) |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech/) Postgres database
- A [Resend](https://resend.com/) API key

### Installation

```bash
git clone https://github.com/mimmiGenevieve/halloweeners.git
cd halloweeners
npm install
```

### Environment Variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL=postgres://...
RESEND_API_KEY=re_...
ADMIN_GUEST_TOKENS=some-admin-token,another-admin-token
```

`ADMIN_GUEST_TOKENS` is a comma-separated allowlist of tokens that get admin access even if `is_admin` isn't set on the guest row.

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000`. Verify the database connection anytime with:

```bash
curl http://localhost:3000/api/neon
```

### Database

The app expects a `guests` table (`id`, `token`, `name`, `is_admin`) and an `rsvps` table (`guest_id`, `email`, `bringing_plus_one`, `plus_one_name`, `cipher_answer`, `updated_at`). Guests are added through the admin panel's **Invited Guests** tab.

Party details (date, address, contact info) live across three single-row tables rather than one:

- **`party_info`** — `date`, `start_time`, `end_time`, `address`, `address_extra_info`
- **`email`** — `from`, `subject`
- **`calendar_info`** — `from_date`, `to_date`, `details`

`fetchPartyInfoAndEmailDetails()` in `lib/queries/party-details.ts` joins all three (currently via a cross join with `LIMIT 1`, since each table holds a single row. This will cause issues if I ever add more than one row) into one `PartyInfo` object. This is what keeps the address and contact details out of source — update them directly in the database rather than in code.

Valid tokens are letters and hyphens only (`^[a-zA-Z-]+$`), up to 200 characters.

### 🎃 Token generation

Tokens are generated automatically when a guest is invited from the admin panel — `lib/token-generator.ts` combines a random modifier ("pink," "grumpy-old," "suspiciously-quiet") with a spooky noun ("ghost," "cauldron," "ouija-board"), then checks the candidate against the `guests` table before using it, retrying up to 20 times if it collides. Style is meant to match the existing token set. Extend `MODIFIERS`/`NOUNS` in that file if the well runs dry.

## 🧪 Testing

### Unit tests (Vitest)

Cover pure logic — token validation/normalization, date formatting, `BoldText` markdown-lite parsing:

```bash
npm run test:unit
```

Config lives in `vitest.config.mts` (note the `.mts` extension — required to avoid an ESM/CJS loader conflict with Vitest's own dependencies) using `happy-dom` as the DOM environment.

### End-to-end tests (Playwright)

Cover full user flows — token auth (link and form), RSVP submission, the winner banner, admin access control, the calendar route's auth guard:

```bash
npm run test:e2e
```

Config in `playwright.config.ts`, specs in `tests/*.spec.ts`, page objects in `tests/pages/`. Playwright auto-starts `next dev` and loads `.env.test.local` for test credentials:

```env
E2E_GUEST_TOKEN=your-seeded-non-winner-token
E2E_GUEST_TOKEN_WINNER=your-seeded-winner-token
E2E_ADMIN_TOKEN=your-seeded-admin-token
```

**Point `DATABASE_URL` at a separate Neon branch for testing**, not the production database — some specs write real RSVP rows (reset via `tests/db.ts` before each run) and the confirmation-email specs send real emails through Resend.

### Tests run automatically before `npm run build`

`scripts/before-build.js` runs as an npm `prebuild` hook, executing both suites before `next build` proceeds — a failing test blocks the build the same way a TypeScript error would. It explicitly skips itself when `VERCEL=1` is set, since Vercel's build environment isn't configured with test tokens or a test database branch; a separate CI step is the right place to gate actual deploys.

## 📦 Deployment

Deployed on Vercel:

```bash
vercel --prod
```

Make sure `DATABASE_URL`, `RESEND_API_KEY`, and `ADMIN_GUEST_TOKENS` are set in the Vercel project's environment variables.

## 📁 Project Structure

```
.
├── app/
│   ├── auth/
│   │   ├── TokenAccessForm.tsx
│   │   └── actions.ts          # form-based token auth
│   ├── rsvp/
│   │   ├── page.tsx
│   │   ├── RsvpForm.tsx
│   │   └── actions.ts          # submitRsvp, sendConfirmationEmail
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── invitedGuests.tsx   # invite/uninvite guests, token generation UI
│   │   ├── rsvps.tsx           # signed-up guest list
│   │   ├── addWinners.tsx      # register this year's prize winners
│   │   ├── prevWinners.tsx     # previous year's winners
│   │   └── actions.ts
│   ├── api/
│   │   ├── neon/                # DB connectivity check
│   │   ├── calendar/            # .ics download, token-guarded
│   │   ├── token/                # link-based token auth (?token=...)
│   │   ├── details-data/
│   │   ├── rsvp-data/
│   │   └── admin-data/
│   ├── PageLayout.tsx
│   ├── LoadingSkeleton.tsx
│   ├── header.tsx
│   └── page.tsx                 # details page, fed by /api/details-data
├── emails/
│   └── halloweeners.tsx         # React Email confirmation template
├── lib/
│   ├── queries/
│   │   ├── guest-auth.ts        # token validation, cookie handling
│   │   ├── party-details.ts     # event details (date, address, contact)
│   │   └── winners.ts
│   ├── helpers/
│   │   ├── misc.tsx             # formatting, token sanitizing, cookie helper
│   │   ├── misc.test.ts
│   │   └── valid-token.ts       # isValidGuestToken, isGuestAdmin
│   ├── types/
│   │   └── details.ts
│   ├── neon.ts                  # Neon client (sql tagged template)
│   ├── auth-cache.ts
│   ├── bold.tsx
│   ├── bold.test.tsx
│   ├── constants.ts
│   └── token-generator.ts       # auto-generates guest tokens
├── tests/
│   ├── auth.spec.ts
│   ├── rsvp.spec.ts
│   ├── admin.spec.ts
│   ├── calendar.spec.ts
│   ├── fixtures.ts              # injects page objects into Playwright's test
│   ├── db.ts                    # test-only DB reset helpers
│   └── pages/                   # Page Object Model classes
├── scripts/
│   └── before-build.js          # runs test suites before next build
└── types/
```

## 🗝️ Notes

- Guest tokens double as access keys — treat invite links like something you wouldn't want forwarded to a stranger. The same trust model extends to the calendar link in confirmation emails, since it carries the guest's own token.
- No spreadsheet sync — the database is the single source of truth for guests, RSVPs, and winners.

---

_Gather your courage. The Halloweeners await._
