# Pull Request

## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an "x" -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (no functional changes, no api changes)
- [ ] Documentation update
- [ ] Design system compliance

## Design System Checklist

<!-- If this PR includes UI changes, verify compliance with the design system -->

### Layout Components
- [ ] Uses `PageContainer` for page wrapper (instead of manual padding/max-width)
- [ ] Uses `PageHeader` for page titles and descriptions
- [ ] Uses `ProjectPageHeader` for project-specific pages with breadcrumbs
- [ ] Uses `PageToolbar` for search and filter bars

### Tables
- [ ] Uses `DataTable` component (not raw `<table>` tags)
- [ ] Implements column sorting and filtering where appropriate
- [ ] Uses `DataTableRowActions` for row actions

### Forms
- [ ] Uses `Form` component with Zod validation
- [ ] Uses form field components (`TextField`, `SelectField`, etc.)
- [ ] Includes proper error handling and validation messages

### Styling
- [ ] No inline `style` attributes (ESLint should catch these)
- [ ] No hard-coded hex colors (uses design tokens or Tailwind classes)
- [ ] Spacing uses Tailwind scale (no arbitrary values like `px-[17px]`)
- [ ] Typography follows design system scale
- [ ] Mobile responsive using standard breakpoints (`sm:`, `md:`, `lg:`, etc.)

### Components
- [ ] Uses `Button` component with appropriate variants
- [ ] Uses `Badge` component for status indicators
- [ ] Uses `Dialog` or `Sheet` for modals/sidebars
- [ ] Uses `Card` for content containers

### Code Quality
- [ ] ESLint passes without warnings
- [ ] TypeScript compiles without errors
- [ ] All tests pass

## Testing

<!-- Describe the testing you've done -->

- [ ] Tested on desktop
- [ ] Tested on mobile/tablet
- [ ] Tested in different browsers
- [ ] Added/updated tests
- [ ] Visual regression tests updated (if applicable)

## Screenshots

<!-- If applicable, add screenshots to help explain your changes -->

**Before:**
<!-- Add screenshot of before state if applicable -->

**After:**
<!-- Add screenshot of after state if applicable -->

## Related Issues

<!-- Link to related issues or tickets -->

Fixes #
Relates to #

## Additional Notes

<!-- Add any additional context or notes for reviewers -->
