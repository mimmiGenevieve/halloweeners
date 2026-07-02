# 🕯️ The Halloweeners — RSVP Portal

> _An invitation is not sent. It is summoned._

A ceremonial, token-gated RSVP site for **The Halloweeners** — no accounts, no passwords, just a personal invite link tied to your name.

Live at [halloweeners.se](https://halloweeners.se).

## ✨ Features

- **Token-based guest access** — each guest is given a unique token (assigned manually, no generator needed). Visiting `/auth/token?token=...` sets an `invite_token` cookie and unlocks the site for 45 days; there's also a form-based entry path for guests typing their token directly.
- **RSVP with a twist** — guests confirm attendance, indicate a plus-one, and answer an in-theme cipher as part of the RSVP flow.
- **Confirmation emails** — sent via Resend from `spirits@halloweeners.se` (or whatever domain you configure in resend) once an RSVP is recorded with an email address.
- **Calendar download** — `/api/calendar` serves an `.ics` file so guests can drop the night straight into their calendar.
- **Admin panel** — a token flagged `is_admin` (or listed in `ADMIN_GUEST_TOKENS`) unlocks `/admin`, where winners for prizes (e.g. Best Duo) are recorded against the guest list.

## 🛠️ Tech Stack

| Layer     | Technology                                                          |
| --------- | ------------------------------------------------------------------- |
| Framework | [Next.js](https://nextjs.org/) 16 (App Router) + React 19           |
| Hosting   | [Vercel](https://vercel.com/)                                       |
| Database  | [Neon](https://neon.tech/) Postgres, via `@neondatabase/serverless` |
| Email     | [Resend](https://resend.com/) + `@react-email/components`           |
| Styling   | Tailwind CSS 4                                                      |
| Auth      | Custom token-based cookie auth (no third-party auth provider)       |

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

The app expects a `guests` table (`id`, `token`, `name`, `is_admin`) and an `rsvps` table (`guest_id`, `email`, `bringing_plus_one`, `plus_one_name`, `cipher_answer`, `updated_at`). Guest tokens are created manually — there's no in-app generator, so add guests directly via the database.

Party details (date, address, contact info) live across three single-row tables rather than one:
- **`party_info`** — `date`, `start_time`, `end_time`, `address`, `address_extra_info`
- **`email`** — `from`, `subject`
- **`calendar_info`** — `from_date`, `to_date`, `details`

`fetchPartyInfoAndEmailDetails()` in `lib/queries/party-details.ts` joins all three (currently via a cross join with `LIMIT 1`, since each table holds a single row. This will cause issues if I ever add more than one row.) into one `PartyInfo` object. This is what keeps the address and contact details out of source — update them directly in the database rather than in code.

Valid tokens are letters and hyphens only (`^[a-zA-Z-]+$`), up to 200 characters.

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
│   │   └── actions.ts         # form-based token auth
│   ├── rsvp/
│   │   ├── page.tsx
│   │   ├── RsvpForm.tsx
│   │   └── actions.ts         # submitRsvp, sendConfirmationEmail
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── WinnersAdminForm.tsx
│   │   ├── winnersRegistry.tsx
│   │   └── actions.ts
│   ├── api/
│   │   ├── neon/               # DB connectivity check
│   │   ├── calendar/           # .ics download
│   │   ├── token/              # link-based token auth (?token=...)
│   │   ├── details-data/
│   │   ├── rsvp-data/
│   │   └── admin-data/
│   ├── InvitationShell.tsx
│   ├── LoadingSkeleton.tsx
│   ├── header.tsx
│   └── page.tsx                # details page, fed by /api/details-data
├── emails/
│   └── halloweeners.tsx        # React Email confirmation template
├── lib/
│   ├── queries/
│   │   ├── guest-auth.ts       # token validation, cookie handling
│   │   ├── party-details.ts    # event details (date, address, contact)
│   │   └── winners.ts
│   ├── types/
│   │   └── details.ts
│   ├── neon.ts                 # Neon client (sql tagged template)
│   ├── auth-cache.ts
│   ├── bold.tsx
│   ├── constants.ts
│   └── helpers.tsx
└── types/
```

## 🗝️ Notes

- Guest tokens double as access keys — treat invite links like something you wouldn't want forwarded to a stranger.
- No spreadsheet sync — the database is the single source of truth for guests, RSVPs, and winners.

---

_Gather your courage. The Halloweeners await._
