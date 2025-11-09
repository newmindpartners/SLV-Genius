module.exports = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 90,
  tabWidth: 2,
  endOfLine: 'auto',
  // Fixes issue with package not working with prettier v3
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  // Formats import statements. See https://github.com/trivago/prettier-plugin-sort-imports
  importOrder: ['^[./]'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
};
