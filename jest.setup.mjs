// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: '/',
      query: {},
      asPath: '/',
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js server Response before it's imported
global.Request = class Request {
  constructor(input, init) {
    this.url = typeof input === 'string' ? input : input.url
    this.method = init?.method || 'GET'
    this.headers = new Headers(init?.headers)
  }
}

global.Response = class Response {
  constructor(body, init) {
    this.body = body
    this.status = init?.status || 200
    this.statusText = init?.statusText || 'OK'
    this.headers = new Headers(init?.headers)
  }
  json() {
    return Promise.resolve(JSON.parse(this.body))
  }
  text() {
    return Promise.resolve(this.body)
  }
}

global.Headers = class Headers {
  constructor(init) {
    this._headers = {}
    if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this._headers[key.toLowerCase()] = value
      })
    }
  }
  get(name) {
    return this._headers[name.toLowerCase()]
  }
  set(name, value) {
    this._headers[name.toLowerCase()] = value
  }
}

// Mock NextResponse
jest.mock('next/server', () => {
  // Create a Response-like object that works with NextResponse
  class MockNextResponse extends Response {
    constructor(body, init) {
      super(body, init)
      this.status = init?.status || 200
      this.statusText = init?.statusText || 'OK'
    }
    json() {
      return Promise.resolve(JSON.parse(this.body))
    }
  }

  // Create a class that can be used with instanceof
  class NextResponseClass extends MockNextResponse {
    static json(body, init) {
      return new NextResponseClass(JSON.stringify(body), {
        ...init,
        status: init?.status || 200,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
    }
    static next(init) {
      return new NextResponseClass(null, init)
    }
  }

  return {
    NextResponse: NextResponseClass,
  }
})


// Mock PointerEvent methods for Radix UI compatibility with JSDOM
if (typeof Element !== 'undefined') {
  Element.prototype.hasPointerCapture = jest.fn().mockReturnValue(false)
  Element.prototype.setPointerCapture = jest.fn()
  Element.prototype.releasePointerCapture = jest.fn()
}

