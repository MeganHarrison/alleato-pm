# Simplified Header Component

## Overview
A new, cleaner header design matching the reference screenshot with a dark background and simplified navigation structure.

## Design Features

### Layout
- **Dark background**: #2d2d2d
- **Fixed height**: 56px (h-14)
- **Clean, minimalist design**
- **Horizontal layout** with three main sections:
  - Left: Logo
  - Center-Left: Dropdowns
  - Right: Action icons

### Components

#### 1. Logo (Left)
- "ALLEATO GROUP" text in uppercase
- Bold, tracking-wider font
- Two-line layout
- Links to home page

#### 2. Project Dropdown (Center-Left)
- Label: "PROJECT" (uppercase, small, gray)
- Current selection: "Goodwill Bart"
- Dropdown arrow indicator
- Dropdown menu with project list

#### 3. Tools Dropdown (Center-Left)
- Label: "TOOLS" (uppercase, small, gray)
- Current selection: "Contracts" (or any tool)
- Dropdown arrow indicator
- Comprehensive dropdown menu with all tools:
  - Core Tools (Home, 360 Reporting, Documents, Directory, Tasks, Admin, Connection Manager)
  - Project Management Tools (Emails, RFIs, Submittals, etc.)
  - Financial Management Tools (Contracts, Budget, Commitments, etc.)

#### 4. Action Icons (Right)
- Search icon (magnifying glass)
- Chat icon (message square)
- Help icon (question mark circle)
- Notifications icon (bell)
- User avatar (circular, with ring border)

All icons are circular with hover states (gray-700 background on hover).

## Usage

### Basic Implementation
```tsx
import { SimplifiedHeader } from "@/components/simplified-header"

export default function YourPage() {
  return (
    <div>
      <SimplifiedHeader
        projectName="Goodwill Bart"
        currentTool="Contracts"
        userAvatar="/path/to/avatar.jpg"
      />
      {/* Your page content */}
    </div>
  )
}
```

### Props
- `projectName?: string` - Current project name (default: "Goodwill Bart")
- `currentTool?: string` - Currently selected tool (default: "Contracts")
- `userAvatar?: string` - User avatar image path (default: "/favicon-light.png")

## File Locations

### Component
- **Main component**: `frontend/src/components/simplified-header.tsx`
- **Test page**: `frontend/src/app/test-header/page.tsx`

### Screenshots
- **Header only**: `frontend/tests/screenshots/simplified-header-only.png`
- **Full page**: `frontend/tests/screenshots/simplified-header-full.png`
- **Reference design**: `scripts/screenshot-capture/outputs/screenshots/Top Nav.png`

## Key Differences from Old Header

### Old Header (site-header.tsx)
- Breadcrumb navigation
- Sidebar trigger
- Complex three-column dropdown for tools
- More visual elements

### New Simplified Header
- No breadcrumbs
- Cleaner, more minimal design
- Simple single-column dropdown
- Focus on essential actions
- Darker, more modern aesthetic

## Styling Details

### Colors
- Background: `#2d2d2d`
- Text: White
- Labels: `text-gray-400`
- Hover: `hover:bg-gray-700`
- Border: `border-gray-700`

### Typography
- Logo: Bold, uppercase, tracking-wider
- Labels: Uppercase, text-[10px]
- Dropdowns: text-sm
- Icons: h-5 w-5

### Spacing
- Height: h-14 (56px)
- Padding: px-6
- Icon gaps: gap-4
- Dropdown gaps: gap-4

## Next Steps

To use this header as the primary header:
1. Replace `<SiteHeader />` with `<SimplifiedHeader />` in your layout
2. Update any references to header context
3. Test navigation and dropdown functionality
4. Adjust any page-specific styling that depends on header height

## Preview
Visit `/test-header` to see the new header in action.
