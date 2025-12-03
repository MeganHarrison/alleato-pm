# Financial Modules Implementation Plan

## Module Priority Order
1. **Commitments** (Subcontracts/POs) - Most data available
2. **Invoicing** - Clear workflow from screenshots
3. **Contracts** (Prime Contracts) - Similar to commitments
4. **Change Events** - Ties everything together

## Commitments Module Components

### 1. List View (`/app/commitments/page.tsx`)
- Table with columns from screenshot
- Search and filter functionality
- Create/Export buttons
- Column configuration

### 2. Create/Edit Form (`/app/commitments/[id]/page.tsx`)
- Number (auto-generated or manual)
- Contract Company (dropdown)
- Title
- Type (Subcontract/PO)
- Original Amount
- Status tracking

### 3. Shared Components
- `CommitmentsTable` - Reusable table component
- `StatusBadge` - For status indicators
- `AmountDisplay` - Currency formatting
- `CompanySelect` - Company dropdown

## Invoicing Module Components

### 1. List View (`/app/invoicing/page.tsx`)
- Tab navigation (Owner/Subcontractor/Billing Periods)
- Status cards (Not Invited, Invited, etc.)
- Invoice table with filtering
- Billing period selector

### 2. Create Billing Period
- Date range selector
- Auto-generate invoices for active commitments

### 3. Invoice Management
- Invite subcontractors
- Track status changes
- Payment recording

## Data Flow

```
Contracts (Prime)
    ↓
Change Events → Change Orders
    ↓
Commitments (Subs/POs)
    ↓
Invoices (by Billing Period)
```

## API Routes Structure

```
/api/commitments
  - GET    / (list with filters)
  - POST   / (create)
  - GET    /[id]
  - PUT    /[id]
  - DELETE /[id]

/api/invoicing
  - GET    /billing-periods
  - POST   /billing-periods
  - GET    /invoices
  - POST   /invoices
  - PUT    /invoices/[id]/status

/api/companies
  - GET    / (for dropdowns)
```

## State Management (Zustand)

```typescript
interface FinancialStore {
  // Commitments
  commitments: Commitment[];
  loadCommitments: () => Promise<void>;
  createCommitment: (data: CommitmentInput) => Promise<void>;
  
  // Invoicing
  currentBillingPeriod: BillingPeriod | null;
  invoices: Invoice[];
  loadInvoices: (periodId: string) => Promise<void>;
  updateInvoiceStatus: (id: string, status: string) => Promise<void>;
}
```

## Next Immediate Steps

1. Set up Supabase project and run schema
2. Create basic layout with navigation
3. Build Commitments list view
4. Add create/edit functionality
5. Implement search and filters