import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  {
    ignores: ['dist/**', 'build/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierRecommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['src/client/**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      ...reactRefresh.configs.vite.rules,
    },
  },
  {
    // shared code runs deterministically on both client and server, so time/randomness must be injected, not read directly
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-param-reassign': ['error', { props: true }],
      'no-restricted-globals': [
        'error',
        {
          name: 'Date',
          message:
            'Do not use Date in src/shared; it is non-deterministic across client/server. Pass timestamps in explicitly.',
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'Math',
          property: 'random',
          message:
            'Do not use Math.random in src/shared; it is non-deterministic across client/server. Use an injected RNG instead.',
        },
      ],
    },
  },
  {
    // root-level config files aren't part of tsconfig.json, so they can't use type-aware rules
    files: ['*.config.{js,ts}'],
    extends: [tseslint.configs.disableTypeChecked],
  }
);
