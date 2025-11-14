/**
 * Jest setup file for unit tests
 * This file is loaded before each test via setupFilesAfterEnv
 */

import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';

// Extend Jest matchers with jest-axe for accessibility testing
expect.extend(toHaveNoViolations);

// Declare custom matchers for TypeScript
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}