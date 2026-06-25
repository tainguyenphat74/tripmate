# SPEC — TripMate

> A small web app for splitting expenses and listing places to visit, made for a group of friends on a trip.
> Personal / for friends, **non-commercial**, simplicity above all.

Version: MVP v0.1 · Updated: 2026-06-25

---

## 1. Objective

Help a group of friends on a trip:
1. **Record expenses** (who paid, split among whom) and see **who owes whom**, with a suggestion for settling up in the fewest transactions.
2. **Build a list of places** they want to visit, and mark places already visited.

Audience: the author and their friends. No marketing, no login, no enterprise-grade security required.

### Core principles
- **Access by link** — nobody has to register or log in, not even the trip creator.
- One trip = one link. Anyone with the link (and the PIN, if set) can view & edit.
- **VND only.**

---

## 2. MVP features (acceptance criteria)

### 2.1. Trip
- [ ] Create a trip: enter a trip name (e.g. "Da Lat 06/2026"). The system generates a hard-to-guess random `join_code` → link of the form `/t/{join_code}`.
- [ ] **PIN (optional)**: when creating, the user may set a PIN (4–6 digits). Leave blank = open trip, anyone with the link can enter.
  - If the trip has a PIN: opening the link prompts for the PIN before entering. A correct entry is remembered once in localStorage (per `join_code`); the same device won't be asked again.
  - The PIN is stored **hashed** in the DB, never in plaintext. PIN verification happens server-side.
- [ ] Opening the link → go straight into the trip (or through the PIN step if set), no login/account needed.
- [ ] The user picks "Who am I" from the member list (saved in localStorage so they don't reselect next time).

### 2.2. Members
- [ ] Add a member by name (e.g. "Phat", "An", "Binh"). No email/account needed.
- [ ] Edit/delete a member's name (cannot delete if already attached to an expense).

### 2.3. Expense
- [ ] Add an expense: description, amount (VND), **payer**, **split among whom**.
- [ ] Two split modes:
  - **Even split** (default): split the amount evenly among the selected people. Any rounding remainder goes to the payer.
  - **Exact amounts**: enter each person's amount (e.g. a meal where everyone ordered differently). The sum must match the expense amount (show an error if it doesn't).
- [ ] Edit/delete an expense.
- [ ] Expense list sorted newest first.

### 2.4. Balances & settle up
- [ ] "Balances" screen: for each person, the net amount they are **owed** or **owe** (total net).
- [ ] Minimal settle-up suggestion: an algorithm that nets debts so the number of transfers is minimal (e.g. 2 transfers instead of 5).
- [ ] A **"Mark as paid"** button for each suggested transfer → records a `settlement`, and balances update.

### 2.5. Places
- [ ] Add a place: name (e.g. "Tuyen Lam Lake"), optional note, optional link (Google Maps).
- [ ] Mark as **visited / not visited**.
- [ ] Edit/delete, reorder (drag-and-drop is a nice-to-have, not required for MVP).

### Out of MVP scope (later)
- Multiple currencies, exchange rates.
- Login, roles/permissions, native/mobile app.
- Day-by-day itinerary with times, planned budget.
- Receipt photo uploads, push notifications.

---

## 3. Tech stack & project structure

- **Framework:** Next.js (App Router) + TypeScript
- **DB + API:** Supabase (Postgres). No Supabase Auth in the MVP — access is by `join_code`.
- **UI:** Tailwind CSS + shadcn/ui
- **Deploy:** Vercel
- **Package manager:** bun

```
tripmate/
├── SPEC.md
├── README.md
├── app/
│   ├── page.tsx                 # Home: create trip / paste link
│   └── t/[code]/
│       ├── page.tsx             # Trip overview
│       ├── expenses/            # Expenses
│       ├── balances/            # Balances & settle up
│       └── places/              # Places list
├── components/
├── lib/
│   ├── supabase.ts              # client
│   ├── settle.ts                # minimal debt-netting algorithm
│   └── split.ts                 # even / exact split
├── supabase/
│   └── migrations/              # SQL schema
└── tests/
```

### Data model (Postgres)

```
trips
  id            uuid pk
  name          text
  join_code     text unique         -- random slug used in the URL
  pin_hash      text null           -- hash of the PIN (null = no PIN set)
  currency      text default 'VND'
  created_at    timestamptz

members
  id            uuid pk
  trip_id       uuid fk -> trips
  name          text
  created_at    timestamptz

expenses
  id            uuid pk
  trip_id       uuid fk -> trips
  payer_id      uuid fk -> members  -- who paid
  description   text
  amount        bigint              -- VND, stored as integer (đồng)
  split_type    text                -- 'even' | 'exact'
  created_at    timestamptz

expense_shares
  id            uuid pk
  expense_id    uuid fk -> expenses
  member_id     uuid fk -> members
  amount        bigint              -- this person's share (VND)

settlements
  id            uuid pk
  trip_id       uuid fk -> trips
  from_id       uuid fk -> members  -- payer of the debt
  to_id         uuid fk -> members  -- receiver
  amount        bigint
  settled_at    timestamptz

places
  id            uuid pk
  trip_id       uuid fk -> trips
  name          text
  note          text null
  url           text null
  visited       boolean default false
  position      int                 -- ordering
  created_at    timestamptz
```

**Computing balances:** for each member, `net = total paid (as payer) - total share owed (shares) - total settled out (from) + total settled in (to)`. Net > 0 = owed money back; Net < 0 = still owes.

---

## 4. Code style

- TypeScript strict. Prefer Server Components; use Client Components only when interaction is needed.
- Store money as **integer VND** (bigint), never floats, to avoid rounding errors.
- Use Server Actions for writes (create/edit/delete); avoid hand-written API routes when not needed.
- Clear naming, English in code; the UI is displayed in Vietnamese.
- Format with Prettier, lint with the Next.js default ESLint config.

---

## 5. Testing strategy

- **Unit tests (Vitest)** for pure logic — required:
  - `lib/split.ts`: even split with a remainder, exact split matching/not matching the total.
  - `lib/settle.ts`: minimal debt netting is correct and balanced (sum = 0).
  - PIN hashing & verification: correct PIN passes, wrong PIN is rejected; a trip without a PIN enters directly.
- **Manual smoke test** of the main flow: create trip → add members → add expense → view balances → mark as paid → add a place.
- E2E (Playwright) is optional, added after the MVP runs reliably.

---

## 6. Boundaries

### Always
- Keep everything simple, true to the "for a group of friends" spirit.
- Store money as integer VND.
- Generate a sufficiently random `join_code` so links can't be guessed.
- Commit after every small change.

### Ask first
- Adding any feature outside the MVP (login, multi-currency, budget, day-by-day itinerary).
- Changing the tech stack or adding a large dependency.
- Changing the data model after real data exists.

### Never
- Require registration/login to view or edit a trip.
- Use floats for money.
- Add commercial tracking/ads/analytics (this is a personal app).
- Expose sensitive data or commit secrets (Supabase keys) to the repo — use environment variables.

---

## Trade-off note
Because there is **no login**, anyone with the link (and the correct PIN, if the trip has one) can view & edit the trip. The optional per-trip PIN lets you keep sensitive trips private; trips left without a PIN stay open via link for convenience. The PIN is only a light protection layer (against strangers who happen to have the link), not account-grade security. Don't share links publicly.
