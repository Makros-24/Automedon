import { renderHook, act } from '@testing-library/react'
import { useInViewOnce } from '../useInViewOnce'

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
})
global.IntersectionObserver = mockIntersectionObserver

describe('useInViewOnce', () => {
  let mockCallback: jest.Mock
  let mockObserver: any

  beforeEach(() => {
    mockCallback = jest.fn()
    mockObserver = {
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }
    mockIntersectionObserver.mockReturnValue(mockObserver)
    mockIntersectionObserver.mockClear()
    mockObserver.observe.mockClear()
    mockObserver.unobserve.mockClear()
    mockObserver.disconnect.mockClear()
  })

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useInViewOnce())
    
    expect(result.current.isInView).toBe(false)
    expect(result.current.hasBeenInView).toBe(false)
    expect(result.current.ref).toBeDefined()
  })

  it('creates IntersectionObserver with default options', () => {
    const { result } = renderHook(() => useInViewOnce())
    
    // Simulate ref being set
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockElement,
    })
    
    // Re-render to trigger effect
    renderHook(() => useInViewOnce())
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
      })
    )
  })

  it('creates IntersectionObserver with custom options', () => {
    const customOptions = {
      threshold: 0.5,
      rootMargin: '10px',
      triggerOnce: false
    }
    
    const { result } = renderHook(() => useInViewOnce(customOptions))
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockElement,
    })
    
    renderHook(() => useInViewOnce(customOptions))
    
    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      expect.objectContaining({
        threshold: 0.5,
        rootMargin: '10px',
      })
    )
  })

  it('observes element when ref is set', () => {
    const { result } = renderHook(() => useInViewOnce())
    
    const mockElement = document.createElement('div')
    
    act(() => {
      Object.defineProperty(result.current.ref, 'current', {
        writable: true,
        value: mockElement,
      })
    })
    
    // Re-render to trigger effect
    renderHook(() => useInViewOnce())
    
    expect(mockObserver.observe).toHaveBeenCalledWith(mockElement)
  })

  it('handles intersection correctly with triggerOnce=true', () => {
    let intersectionCallback: (entries: any[]) => void
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return mockObserver
    })
    
    const { result } = renderHook(() => useInViewOnce({ triggerOnce: true }))
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockElement,
    })
    
    // Re-render to trigger effect
    renderHook(() => useInViewOnce({ triggerOnce: true }))
    
    // Simulate intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })
    
    expect(result.current.isInView).toBe(true)
    expect(result.current.hasBeenInView).toBe(true)
    expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement)
  })

  it('handles intersection correctly with triggerOnce=false', () => {
    let intersectionCallback: (entries: any[]) => void
    
    mockIntersectionObserver.mockImplementation((callback) => {
      intersectionCallback = callback
      return mockObserver
    })
    
    const { result } = renderHook(() => useInViewOnce({ triggerOnce: false }))
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockElement,
    })
    
    renderHook(() => useInViewOnce({ triggerOnce: false }))
    
    // Simulate intersection
    act(() => {
      intersectionCallback([{ isIntersecting: true }])
    })
    
    expect(result.current.isInView).toBe(true)
    expect(mockObserver.unobserve).not.toHaveBeenCalled()
    
    // Simulate leaving intersection
    act(() => {
      intersectionCallback([{ isIntersecting: false }])
    })
    
    expect(result.current.isInView).toBe(false)
  })

  it('cleans up observer on unmount', () => {
    const { result, unmount } = renderHook(() => useInViewOnce())
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockElement,
    })
    
    renderHook(() => useInViewOnce())
    
    unmount()
    
    expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement)
  })

  it('does not create observer if element is null', () => {
    renderHook(() => useInViewOnce())
    
    expect(mockIntersectionObserver).not.toHaveBeenCalled()
    expect(mockObserver.observe).not.toHaveBeenCalled()
  })

  it('does not create observer if hasBeenInView is true', () => {
    const { result, rerender } = renderHook(() => useInViewOnce())
    
    const mockElement = document.createElement('div')
    Object.defineProperty(result.current.ref, 'current', {
      writable: true,
      value: mockElement,
    })
    
    // Simulate hasBeenInView being true
    act(() => {
      ;(result.current as any).hasBeenInView = true
    })
    
    rerender()
    
    expect(mockObserver.observe).not.toHaveBeenCalledWith(mockElement)
  })
})