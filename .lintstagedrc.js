module.exports = {
  // Skip type checking during commit
  '**/*.ts?(x)': () => 'echo "Skipping type check for faster commits"',

  // Run tests only when test files change
  '**/*.test.(ts|js)?(x)': filenames =>
    filenames.length > 0
      ? `jest --bail --passWithNoTests ${filenames.join(' ')}`
      : 'echo "No test files changed"',
};
