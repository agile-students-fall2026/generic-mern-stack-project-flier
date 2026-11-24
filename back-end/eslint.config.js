import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['node_modules', 'coverage', 'public']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended, prettier],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      /**
       * Code conventions (aligned with front-end; formatting owned by Prettier):
       * - Never use var over const and let.
       * - Unused vars are errors (unless marked with _ or ALL_CAPS).
       * - Require const for variables that aren't reassigned.
       * - Use braces for if/for/while, even if single line.
       * - Require ===/!== instead of == !=.
       * - No lone blocks, self-compares, unused expressions, or useless .call/.apply.
       * - No use-before-define.
       * - Require camelCase for variables and functions (object properties allowed).
       * - Prefer else-if over if inside else.
       * - Allow console.log.
       */
      'no-var': ['error'],
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      'prefer-const': ['error', { destructuring: 'any', ignoreReadBeforeAssign: false }],
      curly: ['error'],
      eqeqeq: ['error'],
      'no-lone-blocks': ['error'],
      'no-self-compare': ['error'],
      'no-unused-expressions': ['error'],
      'no-useless-call': ['error'],
      'no-use-before-define': ['error'],
      camelcase: [
        'error',
        { properties: 'never', ignoreDestructuring: true, allow: ['starts_at'] },
      ],
      'no-lonely-if': ['error'],
      'no-console': ['off'],
    },
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      // Chai assertion chains look like unused expressions to ESLint
      'no-unused-expressions': ['off'],
    },
  },
]);
