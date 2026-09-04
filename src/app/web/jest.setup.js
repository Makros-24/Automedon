import '@testing-library/jest-dom'

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback, options) {
    this.callback = callback
    this.options = options
    this.elements = new Set()
  }

  observe(element) {
    this.elements.add(element)
    // Immediately trigger intersection for testing
    this.callback([{
      target: element,
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: element.getBoundingClientRect(),
      rootBounds: null,
      time: Date.now()
    }])
  }

  unobserve(element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock window.scrollTo
global.scrollTo = jest.fn()

// jsdom implements no layout, so it ships neither of these. The recommendations
// carousel scrolls its track on every dot press.
Element.prototype.scrollIntoView = jest.fn()
Element.prototype.scrollTo = jest.fn()

// Mock Image constructor for Next.js Image component.
//
// The callback fires on a timer, so it lands in whichever test happens to be
// running when it does - and images without an onload handler are perfectly
// normal. Calling it unconditionally threw "this.onload is not a function"
// inside an unrelated, later test.
Object.defineProperty(global.Image.prototype, 'src', {
  set() {
    setTimeout(() => {
      if (typeof this.onload === 'function') this.onload()
    })
  },
})

// Suppress console errors for tests unless specifically testing error scenarios
const originalError = console.error
console.error = (...args) => {
  if (typeof args[0] === 'string' && (
    args[0].includes('Warning: ReactDOM.render is no longer supported') ||
    args[0].includes('Warning: An invalid form control') ||
    args[0].includes('act()')
  )) {
    return
  }
  originalError.call(console, ...args)
}