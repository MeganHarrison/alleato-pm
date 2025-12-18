# Manual Test: Project Tools Dropdown

## Test Date
December 12, 2025

## Objective
Verify that the Project Tools dropdown in the header displays the new three-column layout matching the Procore screenshot.

## Test Steps

### 1. Open the Application
- Navigate to: http://localhost:3002
- Wait for the page to fully load

### 2. Locate the Project Tools Dropdown
- Find the "Project Tools" button in the top header
- It should display "Project Tools" label with the current tool name (e.g., "Home")

### 3. Click to Open the Dropdown
- Click the "Project Tools" button
- Dropdown should open with a wide panel (approximately 800px)

### 4. Verify Three-Column Layout

#### Core Tools Column (Left)
Expected items:
- [ ] Home
- [ ] 360 Reporting
- [ ] Documents
- [ ] Directory
- [ ] Tasks
- [ ] Admin
- [ ] Connection Manager (with green "New" badge)

#### Project Management Column (Middle)
Expected items:
- [ ] Emails
- [ ] RFIs (with orange + icon)
- [ ] Submittals (with orange + icon)
- [ ] Transmittals
- [ ] Punch List (with orange + icon)
- [ ] Meetings
- [ ] Schedule
- [ ] Daily Log
- [ ] Photos (with star icon)
- [ ] Drawings
- [ ] Specifications

#### Financial Management Column (Right)
Expected items:
- [ ] Prime Contracts
- [ ] Budget
- [ ] Commitments
- [ ] Change Orders
- [ ] Change Events (with orange + icon)
- [ ] Direct Costs
- [ ] Invoicing

### 5. Test Functionality
- [ ] Click on any tool item (e.g., "Documents")
- [ ] Dropdown should close
- [ ] Reopen dropdown and verify selected tool name appears in the button

### 6. Visual Verification
- [ ] Column headers are bold and properly spaced
- [ ] All items are properly aligned
- [ ] Orange + icons appear on create actions
- [ ] Green "New" badge appears on Connection Manager
- [ ] Star icon appears on Photos
- [ ] Hover states work (light gray background on hover)

## Results
_To be filled after manual testing_

- Status: ✅ PASS / ❌ FAIL
- Notes:

## Screenshots
Screenshots saved to: `frontend/tests/screenshots/project-tools-dropdown.png`
