import { NextRequest } from 'next/server'
import { GET, POST } from '../route'
import { mockSupabaseClient, mockProject } from '@/test-utils/mocks'

// Mock Supabase
jest.mock('@/lib/supabase/server', () => ({
  createClient: jest.fn(() => mockSupabaseClient),
}))

describe('/api/projects', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset mock implementations
    mockSupabaseClient.select.mockReturnThis()
    mockSupabaseClient.from.mockReturnThis()
    mockSupabaseClient.order.mockReturnThis()
    mockSupabaseClient.range.mockReturnThis()
  })

  describe('GET', () => {
    it('returns projects with default pagination', async () => {
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [mockProject],
        error: null,
        count: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual({
        data: [mockProject],
        meta: {
          page: 1,
          limit: 100,
          total: 1,
          totalPages: 1,
        },
      })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
      expect(mockSupabaseClient.select).toHaveBeenCalledWith('*', { count: 'exact' })
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('name', { ascending: true })
      expect(mockSupabaseClient.range).toHaveBeenCalledWith(0, 99)
    })

    it('handles pagination parameters', async () => {
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [],
        error: null,
        count: 50,
      })

      const request = new NextRequest('http://localhost:3000/api/projects?page=2&limit=20')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.meta).toEqual({
        page: 2,
        limit: 20,
        total: 50,
        totalPages: 3,
      })

      expect(mockSupabaseClient.range).toHaveBeenCalledWith(20, 39)
    })

    it('applies search filter', async () => {
      mockSupabaseClient.or.mockReturnThis()
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [mockProject],
        error: null,
        count: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/projects?search=test')
      await GET(request)

      expect(mockSupabaseClient.or).toHaveBeenCalledWith(
        'name.ilike.%test%,"job number".ilike.%test%'
      )
    })

    it('applies state filter', async () => {
      mockSupabaseClient.ilike.mockReturnThis()
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [mockProject],
        error: null,
        count: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/projects?state=construction')
      await GET(request)

      expect(mockSupabaseClient.ilike).toHaveBeenCalledWith('state', 'construction')
    })

    it('excludes specific state', async () => {
      mockSupabaseClient.not.mockReturnThis()
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: [mockProject],
        error: null,
        count: 1,
      })

      const request = new NextRequest('http://localhost:3000/api/projects?excludeState=completed')
      await GET(request)

      expect(mockSupabaseClient.not).toHaveBeenCalledWith('state', 'ilike', 'completed')
    })

    it('handles database errors', async () => {
      mockSupabaseClient.range.mockResolvedValueOnce({
        data: null,
        error: { message: 'Database error' },
        count: null,
      })

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Database error' })
    })

    it('handles unexpected errors', async () => {
      mockSupabaseClient.range.mockRejectedValueOnce(new Error('Unexpected error'))

      const request = new NextRequest('http://localhost:3000/api/projects')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'An unexpected error occurred' })
    })
  })

  describe('POST', () => {
    it('creates a new project successfully', async () => {
      const newProject = {
        name: 'New Project',
        client: 'New Client',
        state: 'pre-construction',
      }

      mockSupabaseClient.single.mockResolvedValueOnce({
        data: { ...newProject, id: 2 },
        error: null,
      })

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual({ ...newProject, id: 2 })

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(newProject)
      expect(mockSupabaseClient.select).toHaveBeenCalled()
      expect(mockSupabaseClient.single).toHaveBeenCalled()
    })

    it('handles creation errors', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: null,
        error: { message: 'Duplicate project name' },
      })

      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: JSON.stringify({ name: 'Duplicate' }),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Duplicate project name' })
    })

    it('handles invalid JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/projects', {
        method: 'POST',
        body: 'invalid json',
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'An unexpected error occurred' })
    })
  })
})