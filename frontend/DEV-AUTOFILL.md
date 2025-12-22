# Development Auto-Fill System

A powerful development-only feature that automatically fills forms with realistic test data using Snaplet's copycat library.

## Quick Start

The auto-fill button appears automatically on forms in development mode (when `NODE_ENV !== 'production'`).

### Example: Contract Form

Visit any form page in development (e.g., `/[projectId]/contracts/new`) and you'll see a purple "Auto-Fill" button with a magic wand icon. Click it to instantly populate all form fields with realistic test data.

## Features

- **Development-only**: Automatically hidden in production
- **One-click population**: Fill entire forms instantly
- **Realistic data**: Uses Snaplet's copycat for deterministic, realistic fake data
- **Type-safe**: Full TypeScript support
- **Customizable**: Easy to add new form types and field generators

## Available Form Presets

The system comes with built-in presets for common construction management forms:

- `project` - Project creation forms (matches exact form dropdown values)
- `contract` - Contract forms
- `company` - Company/client forms
- `contact` - Contact forms
- `budgetLineItem` - Budget line item forms
- `meeting` - Meeting forms
- `changeEvent` - Change event forms
- `commitment` - Commitment/subcontract forms
- `primeContract` - Prime contract forms
- `invoice` - Invoice forms

## Usage

### Option 1: Standalone Button (Recommended)

Add the auto-fill button directly to your form:

```tsx
import { DevAutoFillButton } from '@/hooks/use-dev-autofill';

export function MyForm() {
  const [formData, setFormData] = useState({});

  const updateFormData = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <form>
      {/* Auto-fill button */}
      <DevAutoFillButton
        formType="contract"
        onAutoFill={(data) => updateFormData(data)}
      />

      {/* Your form fields */}
      <input name="title" value={formData.title} />
      {/* ... */}
    </form>
  );
}
```

### Option 2: Using the Hook

For more control, use the `useDevAutoFill` hook:

```tsx
import { useDevAutoFill } from '@/hooks/use-dev-autofill';

export function MyForm() {
  const form = useForm();

  const { autoFill, DevAutoFillButton } = useDevAutoFill(
    'project',
    form.setValue
  );

  return (
    <form>
      <DevAutoFillButton />
      {/* Or use a custom button */}
      <button onClick={autoFill}>Fill Form</button>
      {/* form fields */}
    </form>
  );
}
```

## Adding New Form Types

To add auto-fill support for a new form type:

1. **Add preset to `frontend/src/lib/dev-autofill.ts`**:

```typescript
export const autoFillPresets = {
  // ... existing presets

  myNewForm: {
    title: fakeData.title,
    description: fakeData.description,
    amount: () => fakeData.amount(1000, 50000),
    date: fakeData.futureDate,
    // Add more fields as needed
  },
};
```

2. **Use in your form**:

```tsx
<DevAutoFillButton
  formType="myNewForm"
  onAutoFill={(data) => updateFormData(data)}
/>
```

## Available Data Generators

The `fakeData` object provides generators for common field types:

### Project & Company
- `projectName()` - "Acme Project"
- `projectDescription()` - Sentence
- `companyName()` - "Smith Construction"

### People
- `firstName()`, `lastName()`, `fullName()`
- `email()`, `phone()`

### Addresses
- `streetAddress()`, `city()`, `state()`, `zipCode()`

### Financial
- `amount(min, max)` - Random number in range
- `costCode()` - "01-1234" format

### Dates
- `futureDate()` - 1-365 days in future
- `pastDate()` - 1-365 days in past
- `recentDate()` - 1-30 days in past

### Construction-Specific
- `jobNumber()` - "JOB-1234"
- `contractNumber()` - "CNT-5678"
- `submittalNumber()` - "SUB-123"
- `rfiNumber()` - "RFI-456"

### Generic
- `title()`, `description()`, `notes()`
- `url()`, `percentage()`, `boolean()`

## Customization

### Custom Button Styling

```tsx
<DevAutoFillButton
  formType="contract"
  onAutoFill={handleAutoFill}
  className="bg-blue-500 text-white px-4 py-2 rounded"
>
  Quick Fill
</DevAutoFillButton>
```

### Custom Data Generation

```typescript
// In dev-autofill.ts
export const fakeData = {
  // ... existing generators

  customField: () => {
    // Your custom logic
    return `CUSTOM-${copycat.int(Math.random().toString(), { min: 1000, max: 9999 })}`;
  },
};
```

## Production Safety

The auto-fill system is completely disabled in production:

- Buttons automatically hide when `NODE_ENV === 'production'`
- `isDevelopment` flag prevents accidental usage
- TypeScript ensures type safety even in dev mode

## Technical Details

### Dependencies
- `@snaplet/copycat` - Deterministic fake data generation
- `lucide-react` - Magic wand icon

### Files
- `frontend/src/lib/dev-autofill.ts` - Core data generation logic
- `frontend/src/hooks/use-dev-autofill.tsx` - React hook and button component

## Examples

### Example: Auto-filling a Contract Form

```tsx
import { DevAutoFillButton } from '@/hooks/use-dev-autofill';

export function ContractForm({ formData, updateFormData }) {
  return (
    <form>
      <div className="flex justify-between">
        <DevAutoFillButton
          formType="contract"
          onAutoFill={(data) => updateFormData(data)}
        />
        <div className="flex gap-3">
          <Button variant="outline">Cancel</Button>
          <Button type="submit">Create</Button>
        </div>
      </div>

      {/* Form fields */}
    </form>
  );
}
```

Generated data will include:
- Contract number: "CNT-1234"
- Title: "Prime Contract" or similar
- Description: Realistic paragraph
- Amount: Random value between $50,000 - $5,000,000
- Status: "Draft", "Pending", "Approved", or "Executed"
- Dates: Realistic start/end dates

## Tips

1. **Rapid Testing**: Click auto-fill, submit form, verify backend logic - all in seconds
2. **Consistent Data**: Uses deterministic generation for reproducible tests
3. **Multiple Clicks**: Click multiple times to get different realistic data sets
4. **Form Validation**: Auto-fill respects your form's expected data types and formats

## Future Enhancements

Potential improvements:
- [ ] Add preset selection dropdown (e.g., "Small Project", "Large Project")
- [ ] Save/load custom data templates
- [ ] Integration with Playwright tests
- [ ] API endpoint auto-fill for backend testing
