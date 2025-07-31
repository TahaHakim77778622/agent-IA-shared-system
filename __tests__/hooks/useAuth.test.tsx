import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuth } from '@/hooks/useAuth'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock fetch
global.fetch = vi.fn()

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.logout).toBe('function')
    expect(typeof result.current.refreshUser).toBe('function')
  })

  it('should load user from localStorage on mount', () => {
    const mockUser = { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' }
    localStorageMock.getItem.mockReturnValue('mock-token')

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.user).toBeNull() // Initial state
    expect(result.current.loading).toBe(false)
  })

  it('should handle successful login', async () => {
    const mockUser = { id: 1, email: 'test@example.com', first_name: 'Test', last_name: 'User' }
    const mockResponse = { user: mockUser, token: 'mock-token' }

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.user).toEqual(mockUser)
    expect(result.current.loading).toBe(false)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-token')
  })

  it('should handle login error', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Invalid credentials' })
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@example.com', 'wrong-password')
    })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle network error during login', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })

    expect(result.current.user).toBeNull()
    expect(result.current.loading).toBe(false)
  })

  it('should handle logout', async () => {
    const { result } = renderHook(() => useAuth())

    await act(async () => {
      result.current.logout()
    })

    expect(result.current.user).toBeNull()
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
  })

  it('should refresh user data', async () => {
    const mockUser = { id: 1, email: 'test@example.com', first_name: 'Updated', last_name: 'User' }
    localStorageMock.getItem.mockReturnValue('mock-token')

    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(result.current.user).toEqual(mockUser)
  })

  it('should handle refresh user error', async () => {
    localStorageMock.getItem.mockReturnValue('mock-token')

    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      await result.current.refreshUser()
    })

    expect(result.current.user).toBeNull()
  })
}) 