# Snaplet Seed Guide for Supabase

Complete guide for using Snaplet Seed to populate your Supabase database with realistic test data.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install --save-dev @snaplet/seed @snaplet/copycat tsx postgres
```

### 2. Set Environment Variables

Add to `.env.local` or export:

```bash
export SUPABASE_DB_PASSWORD="your_supabase_password"
```

### 3. Sync Schema (Generate Seed Client)

```bash
npx @snaplet/seed sync
```

This introspects your database and generates a type-safe seed client.

### 4. Run Seeding

```bash
# Dry run (preview SQL)
npx tsx scripts/seed-database.ts --dry-run

# Actually seed the database
npx tsx scripts/seed-database.ts

# Reset database first, then seed
npx tsx scripts/seed-database.ts --reset
```

---

## 📁 Files Overview

| File | Purpose |
|------|---------|
| `seed.config.ts` | Supabase connection & data customization |
| `scripts/seed-database.ts` | Main seeding script |
| `.snaplet/` | Auto-generated seed client (gitignored) |

---

## 🔧 Configuration

### seed.config.ts

Connects to Supabase and customizes data generation:

```typescript
export default defineConfig({
  adapter: () => {
    const client = postgres(connectionString);
    return new SeedPostgres(client);
  },

  models: {
    projects: {
      data: {
        name: (ctx) => `Project ${ctx.seed}`,
        state: () => ['CA', 'TX', 'NY'][Math.floor(Math.random() * 3)],
      },
    },
  },

  select: [
    '!auth.*',    // Exclude Supabase auth tables
    '!storage.*', // Exclude Supabase storage tables
  ],
});
```

---

## 💡 Usage Examples

### Basic: Seed 10 Projects

```typescript
await seed.projects((x) => x(10));
```

### With Custom Data

```typescript
await seed.projects([
  { name: 'Warehouse Project', state: 'California' },
  { name: 'Office Tower', state: 'Texas' },
]);
```

### With Relationships (Inline)

```typescript
await seed.projects([
  {
    name: 'Test Project',
    contracts: (x) => x(1, {
      contract_number: 'PC-001',
      original_contract_amount: 2500000,
    }),
    tasks: (x) => x(5, {
      title: (ctx) => `Task ${ctx.seed + 1}`,
      status: 'pending',
    }),
  },
]);
```

### Using Copycat (Realistic Data)

```typescript
import { copycat } from '@snaplet/copycat';

await seed.clients((x) => x(10, {
  name: (ctx) => copycat.fullName(ctx.seed),
  email: (ctx) => copycat.email(ctx.seed, { domain: 'acme.com' }),
  phone: (ctx) => copycat.phoneNumber(ctx.seed),
}));
```

### Connect to Existing Records

```typescript
// Seed projects first
await seed.projects([{ name: 'Project A' }]);

// Get seeded projects
const projects = await seed.$store.projects;

// Create contracts linked to first project
await seed.contracts([
  {
    project_id: projects[0].id,
    contract_number: 'PC-001',
  },
]);
```

---

## 📊 What Gets Seeded

Running `scripts/seed-database.ts` creates:

| Entity | Count | Details |
|--------|-------|---------|
| **Cost Codes** | 13 | Standard CSI divisions |
| **Clients** | 10 | 1 owner + 9 subcontractors |
| **Projects** | 5 | Warehouse, Office, Retail, Hospital, School |
| **Contracts** | 5 | 1 prime contract per project |
| **Tasks** | 25 | 5 tasks per project |
| **Issues** | 15 | 3 issues per project |
| **Daily Logs** | 35 | 7 days per project |
| **Budget Codes** | 5 | Linked to first project |
| **Budget Line Items** | 5 | 1 per budget code |
| **Commitments** | 3 | Subcontracts for first 3 projects |
| **Meetings** | 1 | For first project |

---

## 🎯 Advanced Usage

### Reset Database

```typescript
const seed = await createSeedClient();
await seed.$resetDatabase(); // ⚠️ DELETES ALL DATA
```

### Dry Run (Preview SQL)

```typescript
const seed = await createSeedClient({ dryRun: true });
// Shows SQL statements without executing
```

### Access Seeded Data

```typescript
// Get all seeded projects
const projects = await seed.$store.projects;

// Use in subsequent seeds
await seed.tasks([
  { project_id: projects[0].id, title: 'New Task' },
]);
```

### Custom Generators

```typescript
// In seed.config.ts
models: {
  contracts: {
    data: {
      contract_number: (ctx) => {
        const year = new Date().getFullYear();
        return `PC-${year}-${String(ctx.seed).padStart(4, '0')}`;
      },
    },
  },
}
```

---

## 🔄 Workflow

### Development

```bash
# 1. Make schema changes
npx supabase db push

# 2. Regenerate seed client
npx @snaplet/seed sync

# 3. Update seed scripts
code scripts/seed-database.ts

# 4. Test with dry run
npx tsx scripts/seed-database.ts --dry-run

# 5. Seed database
npx tsx scripts/seed-database.ts
```

### Testing

```bash
# Reset and seed fresh data
npx tsx scripts/seed-database.ts --reset
```

### CI/CD

```bash
# Seed test database in CI
SUPABASE_DB_PASSWORD=$TEST_DB_PASSWORD npx tsx scripts/seed-database.ts
```

---

## 🛠️ Customization

### Add Your Own Seed Script

```typescript
// scripts/seed-financial-data.ts
import { createSeedClient } from '@snaplet/seed';

const main = async () => {
  const seed = await createSeedClient();

  // Seed commitments with change orders
  await seed.commitments([
    {
      number: 'COM-001',
      title: 'Concrete Subcontract',
      original_amount: 450000,
      change_orders: (x) => x(3, {
        number: (ctx) => `CO-${String(ctx.seed + 1).padStart(3, '0')}`,
        amount: (ctx) => 25000 + ctx.seed * 10000,
        status: 'pending',
      }),
    },
  ]);
};

main();
```

### Custom Data Models

```typescript
// seed.config.ts
models: {
  budget_line_items: {
    data: {
      original_amount: (ctx) => {
        // Generate realistic amounts
        const baseAmounts = [50000, 100000, 250000, 500000];
        return baseAmounts[ctx.seed % baseAmounts.length];
      },
      calculation_method: () => {
        return Math.random() > 0.5 ? 'unit' : 'lump_sum';
      },
    },
  },
}
```

---

## 🚨 Important Notes

### RLS (Row Level Security)

Snaplet Seed bypasses RLS by default (direct database connection). If you need to respect RLS:

```typescript
// Use service role key (bypasses RLS)
const connectionString = `postgres://postgres:${password}@${host}:${port}/${database}`;

// OR authenticate as specific user (respects RLS)
// See Supabase + Snaplet integration docs
```

### Foreign Keys

Snaplet Seed automatically handles foreign key dependencies. It seeds in the correct order.

### Unique Constraints

Use `ctx.seed` to ensure uniqueness:

```typescript
email: (ctx) => `user-${ctx.seed}@example.com`, // Guaranteed unique
```

### Large Datasets

For seeding 1000+ records:

```typescript
// Batch in chunks
for (let i = 0; i < 10; i++) {
  await seed.projects((x) => x(100)); // 100 per batch
}
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
npx @snaplet/seed sync
```

### Foreign Key Violations

Ensure parent records exist first:
```typescript
await seed.projects([...]); // Parents first
await seed.contracts([...]); // Then children
```

### Type Errors

Regenerate seed client after schema changes:
```bash
npx @snaplet/seed sync
```

---

## 📖 Resources

- [Snaplet Seed Docs](https://snaplet-seed.netlify.app/)
- [Copycat (Data Generator)](https://github.com/snaplet/copycat)
- [Supabase Connection Guide](https://supabase.com/docs/guides/database)

---

**Generated:** 2025-12-17
