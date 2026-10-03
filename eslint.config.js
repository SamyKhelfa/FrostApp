// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // Reanimated worklets mutate shared values by design, which the React
      // Compiler rule reads as mutating a value captured by an effect.
      'react-hooks/immutability': 'off',
    },
  },
]);
