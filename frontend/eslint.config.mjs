import path from 'node:path'
import { FlatCompat } from '@eslint/eslintrc'
import turboPlugin from 'eslint-plugin-turbo'
import tseslint from '@typescript-eslint/eslint-plugin'

const compat = new FlatCompat({
  baseDirectory: path.resolve(),
  recommendedConfig: false,
  allConfig: false,
})

const config = [
  ...compat.extends('next/core-web-vitals'),
  {
    plugins: {
      turbo: turboPlugin,
      '@typescript-eslint': tseslint,
    },
    rules: {
      'turbo/no-undeclared-env-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
    },
    ignores: ['**/node_modules/**', '.next/**', 'dist/**', 'coverage/**', 'public/**'],
  },
]

export default config
