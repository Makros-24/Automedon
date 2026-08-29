// @testing-library/jest-dom augments Jest's matcher types (toBeInTheDocument,
// toHaveTextContent, ...). jest.setup.js imports it so the matchers exist at
// runtime, but that file is plain JavaScript, so `tsc` never sees the
// augmentation. Next.js 16 type-checks the test files during `next build`, so
// the augmentation has to be pulled in from a TypeScript file as well.
import '@testing-library/jest-dom';
