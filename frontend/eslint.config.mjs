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
      'turbo/no-undeclared-env-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      // Design System Enforcement
      'react/forbid-component-props': ['warn', { forbid: ['style'] }],
      'react/forbid-dom-props': ['warn', { forbid: ['style'] }],
    },
  },
]

export default config
