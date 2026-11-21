import '@testing-library/jest-dom/vitest';

import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
  delete document.body.dataset.theme;
});

afterEach(() => {
  vi.restoreAllMocks();
});