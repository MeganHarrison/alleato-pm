import path from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from '@typescript-eslint/eslint-plugin'

const compat = new FlatCompat({
  baseDirectory: path.resolve(),
  recommendedConfig: false,
  allConfig: false,
})

const IGNORE_PATTERNS = [
  '.next/**',
  '**/.next/**',
  '**/node_modules/**',
  'dist/**',
  'build/**',
  'out/**',
  'coverage/**',
  'public/**',
  'test-results/**',
]

const config = [
  {
    ignores: IGNORE_PATTERNS,
  },
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      turbo: turboPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      // MANDATORY RULES - All set to 'error' level
      'turbo/no-undeclared-env-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error', // No 'any' types allowed
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      'no-console': ['error', { allow: ['warn', 'error'] }], // No console.log in production
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',

      // Design System Enforcement - Changed to ERROR
      'react/forbid-component-props': ['error', { forbid: ['style'] }],
      'react/forbid-dom-props': ['error', { forbid: ['style'] }],

      // Code Quality
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
]

export default config
