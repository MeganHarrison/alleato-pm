import { z } from 'zod';

const numericString = z
  .string()
  .trim()
  .refine((val) => val === '' || !Number.isNaN(Number(val)), 'Must be numeric');

const amountString = numericString.refine(
  (val) => val !== '' && Number(val) !== 0,
  'Amount must be non-zero'
);

const optionalString = z
  .string()
  .trim()
  .transform((val) => (val === '' ? null : val))
  .nullable()
  .optional();

export const BudgetLineItemSchema = z.object({
  costCodeId: z.string().min(1, 'Budget code required'),
  costType: optionalString,
  qty: numericString.optional(),
  uom: optionalString,
  unitCost: numericString.optional(),
  amount: amountString,
});

export const BudgetLineItemsPayloadSchema = z.object({
  lineItems: z.array(BudgetLineItemSchema).min(1, 'At least one line item is required'),
});

export const BudgetModificationPayloadSchema = z.object({
  budgetItemId: z.string().uuid('budgetItemId must be a valid UUID'),
  amount: amountString,
  title: optionalString,
  description: optionalString,
  reason: optionalString,
  approver: optionalString,
  modificationType: optionalString,
});

export type BudgetLineItemPayload = z.infer<typeof BudgetLineItemsPayloadSchema>;
export type BudgetModificationPayload = z.infer<typeof BudgetModificationPayloadSchema>;
