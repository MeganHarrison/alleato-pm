import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BackendStatusIndicator } from '../backend-status-indicator'
import { mockApiResponses } from '@/test-utils/mocks'

// Mock fetch
global.fetch = jest.fn()

describe('BackendStatusIndicator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows loading state initially', () => {
    (global.fetch as jest.Mock).mockImplementation(() => 
      new Promise(() => {}) // Never resolves
    )
    
    render(<BackendStatusIndicator />)
    expect(screen.getByLabelText('Checking connection')).toBeInTheDocument()
  })

  it('shows connected state when backend is healthy', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApiResponses.health,
    })

    render(<BackendStatusIndicator />)
    
    await waitFor(() => {
      expect(screen.getByText('Backend Connected')).toBeInTheDocument()
    })
    
    expect(screen.getByRole('img', { name: 'Backend connected' })).toHaveClass('text-green-500')
  })

  it('shows disconnected state when backend is not responding', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<BackendStatusIndicator />)
    
    await waitFor(() => {
      expect(screen.getByText('Backend Disconnected')).toBeInTheDocument()
    })
    
    expect(screen.getByRole('img', { name: 'Backend disconnected' })).toHaveClass('text-destructive')
  })

  it('shows OpenAI not configured when openai_configured is false', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockApiResponses.health,
        backend: {
          ...mockApiResponses.health.backend,
          openai_configured: false,
        },
      }),
    })

    render(<BackendStatusIndicator />)
    
    await waitFor(() => {
      expect(screen.getByText(/OpenAI API key not configured/)).toBeInTheDocument()
    })
  })

  it('retries connection check periodically', async () => {
    jest.useFakeTimers()
    
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockApiResponses.health,
    })

    render(<BackendStatusIndicator />)
    
    // Initial call
    expect(global.fetch).toHaveBeenCalledTimes(1)
    
    // Fast forward 15 seconds
    jest.advanceTimersByTime(15000)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(2)
    })
    
    jest.useRealTimers()
  })

  it('handles non-ok response status', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<BackendStatusIndicator />)
    
    await waitFor(() => {
      expect(screen.getByText('Backend Disconnected')).toBeInTheDocument()
    })
  })
})