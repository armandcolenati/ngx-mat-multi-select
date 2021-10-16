module.exports = {
  trailingComma: 'es5',
  tabWidth: 2,
  singleQuote: true,
  printWidth: 140,
  endOfLine: 'crlf',
  quoteProps: 'preserve',
  overrides: [
    {
      files: ['*.json'],
      options: {
        'tabWidth': 2,
      },
    },
  ],
};
