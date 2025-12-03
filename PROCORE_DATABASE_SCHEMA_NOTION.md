# Procore Database Schema - Notion Format

## Core Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| companies | Company/organization accounts | id, name, logo_url, settings, created_at, updated_at | Has many projects, users | ✅ Created |
| users | System users | id, email, first_name, last_name, avatar_url, phone, created_at | Belongs to companies, has roles | ✅ Created |
| projects | Construction projects | id, company_id, name, number, address, start_date, end_date, status, budget | Belongs to company, has many modules | ✅ Created |
| roles | User permission roles | id, name, permissions, created_at | Has many users through user_roles | ✅ Created |
| user_roles | User role assignments | id, user_id, role_id, project_id, created_at | Links users to roles per project | ✅ Created |
| permissions | Granular permissions | id, resource, action, created_at | Belongs to roles | 📋 Planned |

## Financial Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| budgets | Project budgets | id, project_id, total_amount, contingency, created_at, updated_at | Belongs to project, has line items | ✅ Created |
| budget_line_items | Budget breakdown | id, budget_id, cost_code_id, description, amount, committed, spent | Belongs to budget, cost_code | ✅ Created |
| cost_codes | Standardized cost categories | id, company_id, code, name, category, parent_id | Has many line items, hierarchical | ✅ Created |
| commitments | Subcontracts and POs | id, project_id, vendor_id, number, title, amount, status, signed_date | Has change orders, line items | ✅ Created |
| commitment_line_items | Commitment details | id, commitment_id, cost_code_id, description, amount, quantity, unit | Belongs to commitment | ✅ Created |
| change_orders | Contract modifications | id, commitment_id, number, title, amount, status, reason, approved_date | Belongs to commitment | ✅ Created |
| change_order_line_items | Change order details | id, change_order_id, cost_code_id, description, amount | Belongs to change order | 📋 Planned |
| invoices | Payment requests | id, commitment_id, number, amount, date, status, paid_date | Belongs to commitment | 📋 Planned |
| invoice_line_items | Invoice details | id, invoice_id, line_item_id, amount, quantity | Belongs to invoice | 📋 Planned |
| payment_applications | Progress billing | id, project_id, number, period_to, amount, retention, status | Has line items | 📋 Planned |
| prime_contracts | Owner contracts | id, project_id, number, title, amount, signed_date | Has change orders | 📋 Planned |
| vendors | Subcontractors/suppliers | id, company_id, name, type, contact_info, tax_id | Has commitments | 📋 Planned |

## Project Management Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| schedule_tasks | Project schedule items | id, project_id, name, start_date, end_date, duration, predecessor_ids, assigned_to | Belongs to project | 📋 Planned |
| daily_logs | Daily reports | id, project_id, date, weather, temperature, conditions, created_by | Has entries | 📋 Planned |
| daily_log_entries | Log details | id, daily_log_id, type, description, hours, headcount | Belongs to daily log | 📋 Planned |
| documents | File management | id, project_id, folder_id, name, file_url, version, uploaded_by | Belongs to folders | 📋 Planned |
| document_folders | Folder structure | id, project_id, parent_id, name, path | Has documents, hierarchical | 📋 Planned |
| drawings | Construction drawings | id, project_id, set_id, number, title, file_url, revision, date | Belongs to drawing sets | 📋 Planned |
| drawing_sets | Drawing collections | id, project_id, name, discipline, issued_date | Has drawings | 📋 Planned |
| photos | Project photos | id, project_id, album_id, file_url, caption, location, taken_at | Belongs to albums | 📋 Planned |
| photo_albums | Photo collections | id, project_id, name, date, created_by | Has photos | 📋 Planned |
| meetings | Meeting records | id, project_id, title, date, location, attendees, created_by | Has items, minutes | 📋 Planned |
| meeting_items | Meeting agenda/minutes | id, meeting_id, type, title, description, assignee, due_date | Belongs to meeting | 📋 Planned |
| forms | Custom forms | id, project_id, template_id, title, data, submitted_by, submitted_at | Uses form templates | 📋 Planned |
| form_templates | Form definitions | id, company_id, name, fields, category | Has form submissions | 📋 Planned |

## Quality & Safety Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| punch_items | Deficiency list | id, project_id, number, location, description, status, assignee, due_date | Has photos, comments | 📋 Planned |
| inspections | Quality inspections | id, project_id, type, date, inspector, status, result | Has items, photos | 📋 Planned |
| inspection_items | Inspection checklist | id, inspection_id, item, status, notes | Belongs to inspection | 📋 Planned |
| incidents | Safety incidents | id, project_id, date, type, severity, description, reported_by | Has witnesses, photos | 📋 Planned |
| observations | Safety observations | id, project_id, date, type, location, description, hazard_level | Created by users | 📋 Planned |
| permits | Work permits | id, project_id, type, number, issued_date, expiry_date, status | Has inspections | 📋 Planned |

## Design Coordination Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| rfis | Requests for information | id, project_id, number, subject, question, status, due_date, assigned_to | Has responses, attachments | 📋 Planned |
| rfi_responses | RFI answers | id, rfi_id, response, responder_id, responded_at | Belongs to RFI | 📋 Planned |
| submittals | Material submittals | id, project_id, number, spec_section, title, status, submitted_date | Has revisions, approvers | 📋 Planned |
| submittal_revisions | Submittal versions | id, submittal_id, revision, file_url, submitted_date, status | Belongs to submittal | 📋 Planned |
| coordination_issues | Design conflicts | id, project_id, number, title, description, status, assigned_to | Has comments, attachments | 📋 Planned |
| transmittals | Document transmittals | id, project_id, number, subject, sent_date, recipient | Has attachments | 📋 Planned |

## Communication Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| correspondence | Email/letter tracking | id, project_id, subject, type, date, from, to, body | Has attachments | 📋 Planned |
| announcements | Project announcements | id, project_id, title, message, priority, posted_by, posted_at | Visible to users | 📋 Planned |
| comments | Universal comments | id, commentable_type, commentable_id, body, author_id, created_at | Polymorphic to any table | 📋 Planned |
| attachments | File attachments | id, attachable_type, attachable_id, file_url, file_name, uploaded_by | Polymorphic to any table | 📋 Planned |
| notifications | User notifications | id, user_id, type, title, body, read, created_at | Belongs to user | 📋 Planned |
| activity_logs | Audit trail | id, user_id, project_id, action, resource_type, resource_id, details, ip, created_at | Tracks all changes | 📋 Planned |

## Reporting Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| report_templates | Saved report formats | id, company_id, name, type, configuration, created_by | Has generated reports | 📋 Planned |
| generated_reports | Report instances | id, template_id, project_id, data, generated_at, generated_by | Uses templates | 📋 Planned |
| dashboards | Custom dashboards | id, user_id, name, layout, widgets, is_default | Belongs to user | 📋 Planned |
| kpis | Key performance indicators | id, project_id, metric, value, target, date, calculated_at | Project metrics | 📋 Planned |
| forecasts | Financial forecasts | id, project_id, type, amount, date, confidence, created_by | Budget projections | 📋 Planned |

## System Tables

| Table Name | Description | Key Fields | Relationships | Status |
|------------|-------------|------------|---------------|--------|
| integrations | Third-party integrations | id, company_id, type, config, credentials, active | Company settings | 📋 Planned |
| webhooks | Event webhooks | id, company_id, url, events, secret, active | Sends notifications | 📋 Planned |
| api_keys | API access keys | id, company_id, key_hash, name, permissions, last_used | API authentication | 📋 Planned |
| custom_fields | User-defined fields | id, company_id, entity_type, field_name, field_type, options | Extends entities | 📋 Planned |
| field_values | Custom field data | id, field_id, entity_id, value, updated_at | Stores custom data | 📋 Planned |
| email_templates | Email templates | id, company_id, type, subject, body, variables | Automated emails | 📋 Planned |

## Implementation Priority

| Priority | Tables | Reason |
|----------|--------|--------|
| P0 - Critical | companies, users, projects, roles, user_roles | Core system foundation |
| P1 - MVP | budgets, budget_line_items, cost_codes, commitments, commitment_line_items, change_orders | Financial module MVP |
| P2 - Essential | documents, drawings, photos, punch_items, rfis, submittals | Core project management |
| P3 - Important | daily_logs, inspections, meetings, correspondence, activity_logs | Collaboration features |
| P4 - Enhancement | custom_fields, report_templates, dashboards, integrations | Advanced features |

## Key Design Decisions

| Decision | Details |
|----------|---------|
| Multi-tenancy | Row-level security with company_id |
| Soft deletes | deleted_at timestamp on all tables |
| Audit trail | created_by, updated_by, timestamps |
| Polymorphic | Comments and attachments are polymorphic |
| Hierarchical | Cost codes, folders use parent_id |
| Versioning | Documents and drawings track versions |
| Status workflow | Enum types for status fields |

---

*Total Tables: 67 | Status: 14 Created ✅, 53 Planned 📋*

*This schema supports all major Procore functionality with room for extensibility through custom fields and integrations.*