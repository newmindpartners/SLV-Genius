/**
 * This was added to avoid bloating the console with logging errors when testing
 * that a function failed as expected.
 */
global.console = {
  ...console,
  error: jest.fn(),
};
