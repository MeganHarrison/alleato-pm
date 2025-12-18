/**
 * Development Auto-Fill System
 *
 * Provides realistic test data generation for forms in development mode.
 * Uses @snaplet/copycat for deterministic, realistic fake data.
 *
 * IMPORTANT: Only available in development (NODE_ENV !== 'production')
 */

import { copycat } from '@snaplet/copycat';

export const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Generate fake data for common field types
 */
export const fakeData = {
  // Project fields
  projectName: () => {
    const words = copycat.sentence(Math.random().toString(), { max: 3 }).split(' ');
    return `${words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Project`;
  },
  projectDescription: () => copycat.sentence(Math.random().toString()),
  projectNumber: () => copycat.int(Math.random().toString(), { min: 10000, max: 99999 }).toString(),

  // Company fields
  companyName: () => {
    const word = copycat.sentence(Math.random().toString(), { max: 2 }).split(' ')[0];
    const suffix = copycat.oneOf(Math.random().toString(), ['Inc', 'LLC', 'Corp', 'Construction']);
    return `${word.charAt(0).toUpperCase()}${word.slice(1)} ${suffix}`;
  },

  // Person fields
  firstName: () => copycat.firstName(Math.random().toString()),
  lastName: () => copycat.lastName(Math.random().toString()),
  fullName: () => copycat.fullName(Math.random().toString()),
  email: () => copycat.email(Math.random().toString()),
  phone: () => copycat.phoneNumber(Math.random().toString()),

  // Address fields
  streetAddress: () => copycat.streetAddress(Math.random().toString()),
  city: () => copycat.city(Math.random().toString()),
  state: () => copycat.state(Math.random().toString()),
  zipCode: () => copycat.int(Math.random().toString(), { min: 10000, max: 99999 }).toString(),
  country: () => 'USA',

  // Financial fields
  amount: (min = 1000, max = 1000000) => copycat.int(Math.random().toString(), { min, max }),
  costCode: () => {
    const division = copycat.int(Math.random().toString(), { min: 1, max: 16 }).toString().padStart(2, '0');
    const code = copycat.int(Math.random().toString(), { min: 1000, max: 9999 });
    return `${division}-${code}`;
  },

  // Date fields
  futureDate: () => {
    const date = new Date();
    date.setDate(date.getDate() + copycat.int(Math.random().toString(), { min: 1, max: 365 }));
    return date.toISOString().split('T')[0];
  },
  pastDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - copycat.int(Math.random().toString(), { min: 1, max: 365 }));
    return date.toISOString().split('T')[0];
  },
  recentDate: () => {
    const date = new Date();
    date.setDate(date.getDate() - copycat.int(Math.random().toString(), { min: 1, max: 30 }));
    return date.toISOString().split('T')[0];
  },

  // Construction-specific
  jobNumber: () => `JOB-${copycat.int(Math.random().toString(), { min: 1000, max: 9999 })}`,
  contractNumber: () => `CNT-${copycat.int(Math.random().toString(), { min: 1000, max: 9999 })}`,
  submittalNumber: () => `SUB-${copycat.int(Math.random().toString(), { min: 100, max: 999 })}`,
  rfiNumber: () => `RFI-${copycat.int(Math.random().toString(), { min: 100, max: 999 })}`,

  // Generic fields
  title: () => copycat.sentence(Math.random().toString(), { max: 8 }),
  description: () => copycat.paragraph(Math.random().toString()),
  notes: () => copycat.paragraph(Math.random().toString(), { min: 2, max: 4 }),
  url: () => copycat.url(Math.random().toString()),

  // Percentage
  percentage: (min = 0, max = 100) => copycat.int(Math.random().toString(), { min, max }),

  // Boolean
  boolean: () => copycat.bool(Math.random().toString()),
};

/**
 * Auto-fill presets for common form types
 */
export const autoFillPresets = {
  project: {
    name: fakeData.projectName,
    description: fakeData.projectDescription,
    job_number: fakeData.jobNumber,
    client: fakeData.companyName,
    start_date: fakeData.futureDate,
    estimated_revenue: () => fakeData.amount(100000, 10000000),
    estimated_profit: () => fakeData.amount(10000, 1000000),
    state: () => fakeData.state().substring(0, 2).toUpperCase(),
    category: () => copycat.oneOf(Math.random().toString(), ['Commercial', 'Residential', 'Infrastructure', 'Industrial']),
  },

  contract: {
    title: () => `${copycat.oneOf(Math.random().toString(), ['Prime', 'Subcontract', 'Amendment'])} Contract`,
    contract_number: fakeData.contractNumber,
    description: fakeData.description,
    contract_amount: () => fakeData.amount(50000, 5000000),
    start_date: fakeData.recentDate,
    end_date: fakeData.futureDate,
    vendor: fakeData.companyName,
    status: () => copycat.oneOf(Math.random().toString(), ['Draft', 'Pending', 'Approved', 'Executed']),
  },

  company: {
    name: fakeData.companyName,
    address: fakeData.streetAddress,
    city: fakeData.city,
    state: fakeData.state,
    zip: fakeData.zipCode,
    phone: fakeData.phone,
    email: fakeData.email,
    website: fakeData.url,
  },

  contact: {
    first_name: fakeData.firstName,
    last_name: fakeData.lastName,
    email: fakeData.email,
    phone: fakeData.phone,
    title: () => copycat.oneOf(Math.random().toString(), ['Project Manager', 'Superintendent', 'Foreman', 'Engineer', 'Estimator']),
    company: fakeData.companyName,
  },

  budgetLineItem: {
    cost_code: fakeData.costCode,
    description: () => copycat.sentence(Math.random().toString(), { max: 12 }),
    quantity: () => fakeData.amount(1, 1000),
    unit: () => copycat.oneOf(Math.random().toString(), ['EA', 'LF', 'SF', 'CY', 'LS']),
    unit_cost: () => fakeData.amount(10, 1000),
    amount: () => fakeData.amount(1000, 100000),
  },

  meeting: {
    title: () => `${copycat.oneOf(Math.random().toString(), ['Weekly', 'Daily', 'Safety', 'Progress', 'Owner'])} Meeting`,
    date: fakeData.recentDate,
    attendees: () => `${fakeData.fullName()}, ${fakeData.fullName()}, ${fakeData.fullName()}`,
    notes: fakeData.notes,
  },

  changeEvent: {
    number: () => `CE-${copycat.int(Math.random().toString(), { min: 1, max: 999 }).toString().padStart(3, '0')}`,
    title: () => copycat.oneOf(Math.random().toString(), [
      'Unforeseen Site Conditions',
      'Owner Design Change Request',
      'Code Compliance Update',
      'RFI Resolution - Structural Modification',
      'Value Engineering Proposal',
      'Schedule Acceleration Request',
    ]),
    status: () => copycat.oneOf(Math.random().toString(), ['open', 'pending', 'approved', 'rejected']),
    origin: () => copycat.oneOf(Math.random().toString(), ['owner', 'architect', 'contractor', 'field_conditions', 'rfi', 'design_change']),
    type: () => copycat.oneOf(Math.random().toString(), ['allowance', 'owner_change', 'design_error', 'unforeseen_conditions', 'code_requirement']),
    changeReason: () => copycat.oneOf(Math.random().toString(), ['client_request', 'design_development', 'differing_site_conditions', 'errors_and_omissions', 'regulatory_requirement']),
    scope: () => copycat.oneOf(Math.random().toString(), ['in_scope', 'out_of_scope', 'tbd']),
    description: () => copycat.paragraph(Math.random().toString(), { min: 2, max: 3 }),
    estimatedImpact: () => fakeData.amount(5000, 250000),
    notes: () => copycat.paragraph(Math.random().toString()),
  },
};

/**
 * Get auto-fill data for a specific form type
 */
export function getAutoFillData(formType: keyof typeof autoFillPresets): Record<string, any> {
  if (!isDevelopment) {
    console.warn('Auto-fill is only available in development mode');
    return {};
  }

  const preset = autoFillPresets[formType];
  if (!preset) {
    console.warn(`No auto-fill preset found for form type: ${formType}`);
    return {};
  }

  const data: Record<string, any> = {};
  for (const [key, generator] of Object.entries(preset)) {
    data[key] = typeof generator === 'function' ? generator() : generator;
  }

  return data;
}
