# Task Concept: Commitments Module

## Overview
I need to build a comprehensive commitments management module for our construction management platform. This should handle all aspects of subcontractor contracts from creation to completion.

The module needs to feel familiar to Procore users but with a more modern, cleaner interface. Key focus is on speed and usability for project managers who are often on job sites using tablets.

Core functionality includes:
- View all commitments in a sortable/filterable table
- Create and edit commitment details
- Track original contract amount vs current amount (with changes)
- Monitor payment status and invoices
- Handle approval workflows
- Link to our existing change orders module

The UI should be optimized for quick data entry and review, with smart defaults and inline editing where it makes sense.

## Reference URLs
- https://support.procore.com/products/online/user-guide/project-level/commitments
- https://www.procore.com/products/financial-management
- https://help.autodesk.com/view/BIC/ENU/2024/?guid=Commitments_Overview

## Documents & Assets
- /Users/meganharrison/Documents/github/alleato-procore/procore-screenshot-capture/procore-app-screenshots/procore-crawl/commitments/commitments.png
- /Users/meganharrison/Documents/github/alleato-procore/procore-screenshot-capture/procore-app-screenshots/procore-crawl/commitment_change_orders/screenshot.png

## Context

### Project Information
- **Project Name**: alleato-procore
- **Current Phase**: MVP Development
- **Target Users**: Project managers, accountants, subcontractors, field workers

### Technical Stack
- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Backend**: Supabase (PostgreSQL with RLS)
- **Database**: Supabase
- **UI Library**: ShadCN UI, Tailwind CSS
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod

### Existing System
- **Related Modules**: change_orders, invoices, directory, projects
- **Database Tables**: commitments, commitment_line_items, change_orders, commitment_change_orders
- **APIs**: Existing Next.js API routes pattern

### Constraints & Requirements
- **Performance**: Initial load < 2s, instant search/filter, optimistic updates
- **Security**: Row-level security via Supabase, role-based access
- **Compliance**: Audit trail for all changes, data residency in US
- **Device Support**: Responsive design, works offline, tablet-optimized

### Business Context
- **Timeline**: 2-week sprint for MVP
- **Budget**: Using existing infrastructure
- **Success Metrics**: 
  - 90% of users can create commitment in < 2 minutes
  - Zero data loss on poor connections
  - Reduce commitment processing time by 50%

## Additional Notes
- Users often work in areas with poor connectivity, so offline support is critical
- Bulk operations are important (approve multiple, export selected, etc.)
- Integration with accounting systems will come in Phase 2
- Should follow the visual patterns established in our existing modules
- Need to handle complex approval chains (PM → Finance → Executive)