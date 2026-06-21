import '@testing-library/jest-dom';

class MockIntersectionObserver implements IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin = '';
  scrollMargin = '';
  thresholds: ReadonlyArray<number> = [];

  disconnect() {}
  observe() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  unobserve() {}
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});
