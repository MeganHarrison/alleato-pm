# Snaplet Seed Setup — Complete ✅

**Snaplet Seed** is now configured and ready to populate your Supabase database with realistic test data.

---

## 🎉 What Was Set Up

### 1. Dependencies Installed

```json
{
  "@snaplet/seed": "^0.98.0",
  "@snaplet/copycat": "^6.0.0",
  "postgres": "^3.4.7",
  "tsx": "^4.21.0"
}
```

### 2. Configuration Files

| File | Purpose |
|------|---------|
| **[seed.config.ts](seed.config.ts)** | Supabase connection & data model customization |
| **[scripts/seed-database.ts](scripts/seed-database.ts)** | Main seeding script (projects, contracts, budgets, etc.) |
| **[docs/SNAPLET_SEED_GUIDE.md](docs/SNAPLET_SEED_GUIDE.md)** | Complete usage guide |

### 3. NPM Scripts Added

```json
{
  "seed:sync": "Regenerate seed client from database schema",
  "seed:db": "Seed database with test data",
  "seed:db:dry": "Preview SQL without executing",
  "seed:db:reset": "Reset database then seed",
  "schema:docs": "Generate schema documentation"
}
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Set Database Password

```bash
export SUPABASE_DB_PASSWORD="your_supabase_password"
```

Or add to `.env.local`:
```
SUPABASE_DB_PASSWORD=your_actual_password_here
```

### Step 2: Sync Schema (Generate Seed Client)

```bash
npm run seed:sync
```

This introspects your Supabase database and generates a type-safe client in `.snaplet/`.

### Step 3: Seed Database

```bash
# Preview SQL first (dry run)
npm run seed:db:dry

# Actually seed the database
npm run seed:db
```

---

## 📊 What Gets Seeded

Running `npm run seed:db` creates **realistic test data**:

| Entity | Count | Examples |
|--------|-------|----------|
| **Cost Codes** | 13 | 01-100 General Requirements, 03-300 Concrete, 26-000 Electrical |
| **Clients** | 10 | ABC Construction, XYZ Builders, Acme Contractors |
| **Projects** | 5 | Warehouse Project 1, Office Tower, Retail Center |
| **Contracts** | 5 | Prime contracts linked to projects |
| **Tasks** | 25 | Review Plans, Order Materials, Submit RFI (5 per project) |
| **Issues** | 15 | 3 issues per project with status/priority |
| **Daily Logs** | 35 | 7 days of logs per project |
| **Budget Codes** | 5 | Linked to first project |
| **Budget Line Items** | 5 | Realistic amounts ($50K-$500K) |
| **Commitments** | 3 | Subcontracts for concrete, electrical, plumbing |
| **Meetings** | 1 | Weekly Project Status Meeting |

**Total Records Created:** ~100+

---

## 💡 Usage Examples

### Basic Seeding

```bash
npm run seed:db              # Seed database
npm run seed:db:dry          # Preview SQL only
npm run seed:db:reset        # Reset DB first, then seed
```

### Custom Seeding Script

```typescript
// scripts/my-custom-seed.ts
import { createSeedClient } from '@snaplet/seed';

const main = async () => {
  const seed = await createSeedClient();

  // Seed 10 projects with custom data
  await seed.projects((x) => x(10, {
    name: (ctx) => `Project ${ctx.seed + 1}`,
    state: 'California',
    estimated_value: 5000000,
  }));

  // Seed with relationships
  await seed.projects([
    {
      name: 'Flagship Project',
      contracts: (x) => x(1, {
        contract_number: 'PC-001',
        original_contract_amount: 10000000,
      }),
      tasks: (x) => x(10, {
        title: (ctx) => `Task ${ctx.seed + 1}`,
        status: 'pending',
      }),
    },
  ]);
};

main();
```

Run it:
```bash
npx tsx scripts/my-custom-seed.ts
```

### Using Copycat (Realistic Data)

```typescript
import { copycat } from '@snaplet/copycat';

await seed.clients((x) => x(20, {
  name: (ctx) => copycat.companyName(ctx.seed),
  email: (ctx) => copycat.email(ctx.seed, { domain: 'construction.com' }),
  phone: (ctx) => copycat.phoneNumber(ctx.seed),
}));
```

---

## 🔧 Configuration

### Customize Data Generation

Edit **[seed.config.ts](seed.config.ts)**:

```typescript
export default defineConfig({
  models: {
    projects: {
      data: {
        name: (ctx) => `Project ${ctx.seed}`,
        state: () => ['CA', 'TX', 'NY', 'FL'][Math.floor(Math.random() * 4)],
        estimated_value: () => Math.floor(Math.random() * 10000000) + 1000000,
      },
    },
    contracts: {
      data: {
        contract_number: (ctx) => {
          const year = new Date().getFullYear();
          return `PC-${year}-${String(ctx.seed).padStart(4, '0')}`;
        },
      },
    },
  },
});
```

### Exclude Tables

```typescript
select: [
  '!auth.*',         // Exclude Supabase auth
  '!storage.*',      // Exclude Supabase storage
  '!legacy_*',       // Exclude legacy tables
],
```

---

## 🔄 Workflow

### After Schema Changes

```bash
# 1. Apply migration
npx supabase db push

# 2. Regenerate seed client
npm run seed:sync

# 3. Update seed scripts (if needed)
code scripts/seed-database.ts

# 4. Test with dry run
npm run seed:db:dry

# 5. Seed database
npm run seed:db
```

### For Testing/Development

```bash
# Fresh start
npm run seed:db:reset
```

---

## 📖 Documentation

### Complete Guide

**[docs/SNAPLET_SEED_GUIDE.md](docs/SNAPLET_SEED_GUIDE.md)** — Full documentation including:
- Installation
- Configuration
- Usage examples
- Advanced patterns
- Troubleshooting

### Schema Documentation

**[docs/schema/INDEX.md](docs/schema/INDEX.md)** — Browse all 178 tables:
- Individual table files
- Relationship diagrams
- Foreign key mappings

---

## 🎯 Common Use Cases

### 1. Reset & Seed Fresh Data

```bash
npm run seed:db:reset
```

### 2. Seed Test Environment

```bash
SUPABASE_DB_PASSWORD=$TEST_PASSWORD npm run seed:db
```

### 3. Preview Changes Before Seeding

```bash
npm run seed:db:dry > seed-preview.sql
```

### 4. Seed Only Specific Tables

```typescript
// scripts/seed-financials-only.ts
const seed = await createSeedClient();

await seed.cost_codes([...]);
await seed.projects([...]);
await seed.contracts([...]);
```

### 5. Generate Large Datasets

```typescript
// Seed 100 projects
await seed.projects((x) => x(100, {
  name: (ctx) => `Project ${ctx.seed + 1}`,
}));
```

---

## 🚨 Important Notes

### Environment Variables

**Required:**
```bash
SUPABASE_DB_PASSWORD="your_password"
```

**Optional (defaults provided):**
```bash
SUPABASE_DB_HOST="db.lgveqfnpkxvzbnnwuled.supabase.co"
SUPABASE_DB_PORT="5432"
SUPABASE_DB_NAME="postgres"
SUPABASE_DB_USER="postgres"
```

### RLS (Row Level Security)

Snaplet Seed uses direct database connection, **bypassing RLS**. This is intentional for seeding.

### Foreign Keys

Snaplet automatically handles dependencies. Seed in any order — it figures it out.

### Type Safety

The seed client is **fully typed** based on your actual database schema.

```typescript
// TypeScript knows about your columns
await seed.projects({
  name: 'Test',        // ✅ Valid
  invalid_field: 123,  // ❌ TypeScript error
});
```

---

## 🐛 Troubleshooting

### "Missing password" Error

```bash
export SUPABASE_DB_PASSWORD="your_actual_password"
```

### "Table not found" Error

Re-sync schema:
```bash
npm run seed:sync
```

### Foreign Key Violations

Seed parent tables first:
```typescript
await seed.projects([...]);  // Parent
await seed.contracts([...]);  // Child
```

### Type Errors After Schema Changes

Regenerate seed client:
```bash
npm run seed:sync
```

---

## 🔗 Comparison with Bootstrap API

| Feature | Snaplet Seed | Bootstrap API |
|---------|-------------|---------------|
| **Purpose** | General-purpose seeding | Single test project |
| **Flexibility** | Customize any table | Fixed template |
| **Data Volume** | Seed 1000s of records | 1 project |
| **Type Safety** | Full TypeScript support | API response types |
| **Realistic Data** | Copycat integration | Hardcoded values |
| **Use Case** | Dev, test, staging | E2E tests, demos |

**Use Snaplet Seed when:**
- You need flexible seeding
- You want realistic data
- You need to seed multiple projects
- You're populating dev/staging environments

**Use Bootstrap API when:**
- You need one fully-wired test project
- You're writing E2E tests
- You want a quick demo project
- You don't need to customize data

---

## 📚 Resources

- **[Snaplet Seed Docs](https://snaplet-seed.netlify.app/)** — Official documentation
- **[Copycat Docs](https://github.com/snaplet/copycat)** — Realistic data generation
- **[Project Bootstrap](docs/PROJECT-BOOTSTRAP.md)** — One-click test project API
- **[Schema Documentation](docs/schema/INDEX.md)** — All 178 tables documented

---

## ✅ Next Steps

1. **Set password**: `export SUPABASE_DB_PASSWORD="..."`
2. **Sync schema**: `npm run seed:sync`
3. **Test dry run**: `npm run seed:db:dry`
4. **Seed database**: `npm run seed:db`
5. **Customize**: Edit `scripts/seed-database.ts`

---

**Setup Complete:** 2025-12-17
**Seed Script:** [scripts/seed-database.ts](scripts/seed-database.ts)
**Documentation:** [docs/SNAPLET_SEED_GUIDE.md](docs/SNAPLET_SEED_GUIDE.md)
