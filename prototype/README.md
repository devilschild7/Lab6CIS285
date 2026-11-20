# SplitSmart

SplitSmart records shared expenses and calculates each group member’s balance. A positive balance is due to the member, and a negative balance is owed by the member.

## Run locally

From `prototype/`, install dependencies with `npm ci` if needed. If the existing local database URL is unset, create a `.env` file containing:

```dotenv
DATABASE_URL="file:./dev.db"
```

Initialize the SQLite schema and start Next.js:

```sh
npx prisma db push
npm run dev
```

Open http://localhost:3000 or the forwarded port 3000 in Codespaces. Create a group, add its members, and record an expense by choosing the payer and checking everyone who shares the cost.

Expenses and their shares are stored as integer cents. When an expense cannot be divided evenly, the extra cents go to the selected participants in member creation order, one cent per participant until the remainder is exhausted.
