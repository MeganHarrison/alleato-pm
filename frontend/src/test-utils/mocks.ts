// Mock data for tests
export const mockProject = {
  id: 1,
  name: 'Test Project',
  job_number: 'JOB-001',
  client: 'Test Client',
  start_date: '2024-01-01',
  end_date: '2024-12-31',
  state: 'construction',
  phase: 'Phase 1',
  estimated_revenue: 1000000,
  estimated_profit: 200000,
  category: 'Commercial',
  is_flagged: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockCommitment = {
  id: '1',
  number: 'COM-001',
  title: 'Test Commitment',
  status: 'approved',
  type: 'contract',
  contract_company_id: 'company-1',
  contract_company: {
    id: 'company-1',
    name: 'Test Company',
    email: 'test@company.com',
  },
  assignee_id: 'user-1',
  assignee: {
    id: 'user-1',
    email: 'user@test.com',
    full_name: 'Test User',
  },
  description: 'Test commitment description',
  payment_terms: 'Net 30',
  contract_date: '2024-01-01',
  start_date: '2024-01-01',
  substantial_completion_date: '2024-12-31',
  original_amount: 100000,
  approved_change_orders: 0,
  revised_contract_amount: 100000,
  billed_to_date: 50000,
  balance_to_finish: 50000,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  full_name: 'Test User',
  role: 'admin',
  created_at: '2024-01-01T00:00:00Z',
}

export const mockCompany = {
  id: 'company-1',
  name: 'Test Construction Co.',
  email: 'info@testconstruction.com',
  phone: '555-1234',
  address: '123 Main St',
  city: 'Test City',
  state: 'CA',
  zip: '12345',
  country: 'USA',
  is_vendor: true,
  created_at: '2024-01-01T00:00:00Z',
}

// Mock API responses
export const mockApiResponses = {
  projects: {
    list: {
      data: [mockProject],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    },
    detail: {
      project: mockProject,
      tasks: [],
      insights: [],
    },
  },
  commitments: {
    list: {
      data: [mockCommitment],
      meta: {
        page: 1,
        limit: 10,
        total: 1,
        totalPages: 1,
      },
    },
  },
  health: {
    status: 'ok',
    backend: {
      connected: true,
      url: 'http://localhost:8051',
      openai_configured: true,
    },
  },
}

// Mock Supabase client
export const mockSupabaseClient = {
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signUp: jest.fn().mockResolvedValue({ data: { user: mockUser }, error: null }),
    signOut: jest.fn().mockResolvedValue({ error: null }),
  },
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data: mockProject, error: null }),
  order: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  not: jest.fn().mockReturnThis(),
  or: jest.fn().mockReturnThis(),
}