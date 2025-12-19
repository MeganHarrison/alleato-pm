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
  'scripts/**', // Utility scripts - allow console.log
  'tests/**', // Test files - allow console.log
  'verify-*.js', // Verification scripts - allow console.log
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
      // MANDATORY RULES - Errors that BLOCK commits/pushes
      'turbo/no-undeclared-env-vars': 'off',
      'react-hooks/rules-of-hooks': 'error', // Critical: React hooks must follow rules
      'no-debugger': 'error', // Never ship debuggers
      'prefer-const': 'error',
      'no-var': 'error',

      // IMPORTANT RULES - Warnings (will become errors incrementally)
      '@typescript-eslint/no-explicit-any': 'warn', // TODO: Change to error after cleanup
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true
      }],
      'no-console': ['warn', { allow: ['warn', 'error'] }], // TODO: Change to error after cleanup
      'react-hooks/exhaustive-deps': 'warn', // TODO: Change to error after deps fixed
      'no-alert': 'warn', // TODO: Replace alerts with toast notifications
      'react/no-unescaped-entities': 'warn', // TODO: Fix escaped quotes in JSX
      'react/display-name': 'warn', // TODO: Add display names to components

      // Design System Enforcement - Warnings for now
      'react/forbid-component-props': ['warn', { forbid: ['style'] }],
      'react/forbid-dom-props': ['warn', { forbid: ['style'] }],
    },
  },
]

export default config
