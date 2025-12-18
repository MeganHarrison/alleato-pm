# Snaplet Seed — Quick Start Card

**3-step setup to seed your Supabase database with realistic test data.**

---

## ⚡ Quick Start

```bash
# 1. Set database password
export SUPABASE_DB_PASSWORD="your_password"

# 2. Generate seed client
npm run seed:sync

# 3. Seed database
npm run seed:db
```

Done! Your database now has **100+ records** of realistic test data.

---

## 📦 What Gets Created

- ✅ 13 cost codes (01-100 through 26-000)
- ✅ 10 clients (owners & subcontractors)
- ✅ 5 projects (Warehouse, Office, Retail, Hospital, School)
- ✅ 5 prime contracts
- ✅ 25 tasks
- ✅ 15 issues
- ✅ 35 daily logs
- ✅ 5 budget codes + line items
- ✅ 3 commitments
- ✅ 1 meeting

---

## 🔥 Common Commands

```bash
npm run seed:db           # Seed database
npm run seed:db:dry       # Preview SQL (don't execute)
npm run seed:db:reset     # Reset DB first, then seed
npm run seed:sync         # Regenerate client after schema changes
```

---

## 📝 Custom Seeding Example

```typescript
// scripts/my-seed.ts
import { createSeedClient } from '@snaplet/seed';
import { copycat } from '@snaplet/copycat';

const seed = await createSeedClient();

// Seed 10 projects
await seed.projects((x) => x(10, {
  name: (ctx) => `Project ${ctx.seed + 1}`,
  state: 'California',
}));

// Seed with realistic data
await seed.clients((x) => x(20, {
  name: (ctx) => copycat.companyName(ctx.seed),
  email: (ctx) => copycat.email(ctx.seed),
}));
```

Run: `npx tsx scripts/my-seed.ts`

---

## 🔧 Configuration

**[seed.config.ts](seed.config.ts)** — Customize data generation

```typescript
models: {
  projects: {
    data: {
      name: (ctx) => `Project ${ctx.seed}`,
      state: () => ['CA', 'TX', 'NY'][Math.floor(Math.random() * 3)],
    },
  },
}
```

---

## 📚 Full Documentation

- **[SNAPLET_SEED_SETUP_COMPLETE.md](SNAPLET_SEED_SETUP_COMPLETE.md)** — Complete setup guide
- **[docs/SNAPLET_SEED_GUIDE.md](docs/SNAPLET_SEED_GUIDE.md)** — Full usage documentation
- **[scripts/seed-database.ts](scripts/seed-database.ts)** — Main seed script

---

## 🆚 vs. Bootstrap API

| Use Snaplet Seed | Use Bootstrap API |
|------------------|-------------------|
| Flexible seeding | One test project |
| Realistic data | Hardcoded values |
| Dev/staging environments | E2E tests |
| Customize any table | Fixed template |

**Bootstrap API:** `/api/projects/bootstrap` (see [docs/PROJECT-BOOTSTRAP.md](docs/PROJECT-BOOTSTRAP.md))

---

**Setup:** ✅ Complete  
**Ready to use:** 🎯 Yes  
**Next:** Set password & run `npm run seed:db`
