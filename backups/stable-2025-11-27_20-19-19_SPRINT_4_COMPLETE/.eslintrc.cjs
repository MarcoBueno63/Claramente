module.exports = {
  root: true,
  overrides: [
    {
      files: ["tests/**", "**/*.test.*"],
      rules: {
        // test files in this project may use `require()` for compatibility with some test helpers
        "@typescript-eslint/no-require-imports": "off"
      }
    }
  ]
};
