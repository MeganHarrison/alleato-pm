# Project Setup Wizard - Comprehensive Testing Instructions

## Overview
These instructions guide you through comprehensive testing of the Project Setup Wizard at `/[projectId]/setup`. The wizard should allow users to configure a new project through 5 sequential steps.

## Pre-Test Setup

1. **Start the Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Wait for: "Ready on http://localhost:3000" (or similar port)

2. **Open Browser Developer Tools**
   - Chrome: F12 or Cmd+Option+I (Mac)
   - Keep Console tab open to monitor for errors
   - Enable "Preserve log" to capture all messages

3. **Navigate to Wizard**
   - Go to: http://localhost:3000/1/setup
   - Replace port if different
   - The "1" represents project ID - any number should work

## Expected Wizard Structure

The wizard should have 5 steps displayed at the top:
1. **Cost Code Configuration** - Import/create cost codes
2. **Project Directory** - Assign team members
3. **Project Documents** - Upload initial documents
4. **Budget Setup** - Configure project budget
5. **Contract Management** - Set up prime contract

## Detailed Test Cases

### Test Case 1: Initial Load & UI Verification
**Objective**: Verify wizard loads correctly with all UI elements

**Steps**:
1. Navigate to /1/setup
2. Verify page loads without errors
3. Check that all 5 step indicators are visible
4. Confirm Step 1 is highlighted as active
5. Verify presence of:
   - Progress bar showing 0% or 20% (1/5 steps)
   - "Cost Code Configuration" heading
   - Next/Previous navigation buttons
   - Skip button (if applicable)

**Expected Results**:
- No console errors
- Clean, professional UI layout
- All elements properly aligned
- Responsive to window resize

**Screenshot Required**: wizard-initial-load.png

### Test Case 2: Cost Code Configuration (Step 1)
**Objective**: Test all functionality in Step 1

**Sub-tests**:

#### 2.1 Import Standard Codes
1. Click "Import Standard Codes" button
2. Wait for codes to load
3. Verify list populates with CSI format codes
4. Check that each code has:
   - Code number (e.g., "03 10 00")
   - Description
   - Toggle/checkbox for selection

**Expected**: Should load 300+ standard construction codes

#### 2.2 Search/Filter Codes
1. Use search box to filter codes
2. Try searches: "concrete", "electrical", "plumbing"
3. Verify filtering works in real-time
4. Clear search and verify all codes return

#### 2.3 Add Custom Code
1. Click "Add Custom Code" button
2. Fill in:
   - Code: "99 10 00"
   - Name: "Custom Test Code"
   - Description: "Test custom code creation"
3. Submit form
4. Verify code appears in list
5. Try adding duplicate code (should show error)

#### 2.4 Select Codes & Continue
1. Select 5-10 codes using checkboxes
2. Click "Continue" or "Next"
3. Verify navigation to Step 2

**Screenshot Required**: wizard-cost-codes-selected.png

### Test Case 3: Project Directory (Step 2)
**Objective**: Test team assignment functionality

**Steps**:
1. Verify Step 2 is now active in progress bar
2. Check for form sections:
   - Owner information
   - Project Manager assignment
   - Team member additions
3. Add team members:
   - Click "Add Team Member"
   - Select role from dropdown
   - Enter name/email
   - Assign permissions if available
4. Try to continue without required fields (should show validation)
5. Fill all required fields
6. Click "Continue" to Step 3

**Expected Results**:
- Form validation works
- Can add multiple team members
- Roles are predefined (PM, Super, Engineer, etc.)

**Screenshot Required**: wizard-project-directory.png

### Test Case 4: Document Upload (Step 3)
**Objective**: Test file upload functionality

**Steps**:
1. Verify Step 3 is active
2. Look for upload area (drag-drop zone)
3. Test upload methods:
   - Click to browse files
   - Drag and drop (if implemented)
4. Upload test files:
   - PDF document
   - Image file (JPG/PNG)
   - Try invalid file type (should show error)
5. Verify uploaded files display with:
   - Filename
   - File size
   - Upload date
   - Delete option
6. Organize files into folders (if feature exists)
7. Click "Continue" to Step 4

**Expected Results**:
- Files upload successfully
- Progress indicators during upload
- File type validation works
- Can remove uploaded files

**Screenshot Required**: wizard-documents-uploaded.png

### Test Case 5: Budget Setup (Step 4)
**Objective**: Test budget configuration

**Steps**:
1. Verify Step 4 is active
2. Check if cost codes from Step 1 appear
3. For each cost code, enter:
   - Budgeted amount
   - Unit of measure
   - Quantity
4. Verify calculations:
   - Line item totals auto-calculate
   - Grand total updates dynamically
5. Test budget features:
   - Add contingency line
   - Apply markup percentage
   - Set budget alerts/thresholds
6. Try entering invalid data:
   - Negative numbers
   - Text in number fields
7. Export budget (if available):
   - CSV format
   - PDF preview
8. Click "Continue" to Step 5

**Expected Results**:
- All calculations accurate
- Validation prevents invalid entries
- Can save draft (if implemented)
- Export functions work

**Screenshot Required**: wizard-budget-configured.png

### Test Case 6: Contract Setup (Step 5)
**Objective**: Test prime contract configuration

**Steps**:
1. Verify Step 5 is active (final step)
2. Fill contract details:
   - Contract number
   - Contract amount
   - Start/end dates
   - Payment terms
   - Retention percentage
3. Test Schedule of Values:
   - Toggle SOV option
   - Add SOV line items
   - Verify totals match contract amount
4. Set contract options:
   - Approval workflow
   - Document requirements
   - Insurance requirements
5. Review summary of all steps
6. Click "Complete Setup" or "Finish"

**Expected Results**:
- All contract fields functional
- SOV calculations correct
- Can navigate back to review previous steps
- Completion triggers appropriate action

**Screenshot Required**: wizard-contract-final.png

### Test Case 7: Navigation Testing
**Objective**: Test wizard navigation thoroughly

**Steps**:
1. Start fresh at Step 1
2. Navigate forward to Step 3
3. Click "Previous" to go back to Step 2
4. Click "Previous" again to Step 1
5. Use step indicators to jump directly to Step 4
6. Test browser back/forward buttons
7. Refresh page and check if progress saved

**Expected Results**:
- Navigation works in all directions
- Data persists when moving between steps
- Direct step jumping allowed (if implemented)
- Progress saved or warning shown on refresh

### Test Case 8: Skip Functionality
**Objective**: Test skipping optional steps

**Steps**:
1. On each step, check if "Skip" button is available
2. Skip allowed steps and verify:
   - Progress bar updates correctly
   - Can return to skipped steps
   - Skipped steps marked differently
3. Try to skip required steps (should be prevented)

**Expected Results**:
- Can skip optional steps
- Cannot skip required steps
- Visual indication of skipped vs completed steps

### Test Case 9: Error Handling
**Objective**: Test system resilience

**Steps**:
1. Disconnect network and try actions
2. Submit forms with invalid data
3. Upload oversized files
4. Navigate rapidly between steps
5. Open wizard in multiple tabs

**Expected Results**:
- Graceful error messages
- No data loss on errors
- Recovery options provided
- No console errors or crashes

**Screenshot Required**: wizard-error-state.png

### Test Case 10: Responsive Design
**Objective**: Test on different screen sizes

**Steps**:
1. Test on desktop (1920x1080)
2. Resize to tablet (768x1024)
3. Resize to mobile (375x667)
4. Check each step at each size
5. Test touch interactions on mobile size

**Expected Results**:
- Layout adapts properly
- All functions accessible
- Text remains readable
- Buttons are touch-friendly on mobile

**Screenshot Required**: wizard-mobile-view.png

### Test Case 11: Performance Testing
**Objective**: Verify acceptable performance

**Metrics to Measure**:
1. Initial page load time (target: <3 seconds)
2. Step navigation time (target: <500ms)
3. File upload time for 10MB file
4. Time to load 300+ cost codes
5. Memory usage over 10-minute session

**Tools**: Browser DevTools Network & Performance tabs

### Test Case 12: Data Validation & Persistence
**Objective**: Ensure data integrity

**Steps**:
1. Complete entire wizard with valid data
2. Check if data saves to database (check Supabase)
3. Reload page and verify data persists
4. Start new wizard session - should be empty
5. Check for data leaks between projects

**Expected Results**:
- All data saves correctly
- No data mixing between projects
- Appropriate success confirmations

## Bug Reporting Format

For each bug found, document:

```markdown
### Bug #[number]: [Brief Description]
**Severity**: Critical/High/Medium/Low
**Step**: Which wizard step
**Steps to Reproduce**:
1. [Detailed step 1]
2. [Detailed step 2]
3. [Continue...]

**Expected Result**: What should happen
**Actual Result**: What actually happened
**Error Messages**: Copy any console errors
**Screenshot**: [filename]
**Browser/OS**: Chrome 120 on macOS 14
**Additional Notes**: Any relevant context
```

## Final Testing Checklist

Before marking testing complete:
- [ ] All 12 test cases executed
- [ ] Screenshots captured for key states
- [ ] Performance metrics recorded
- [ ] All bugs documented properly
- [ ] Console checked for warnings/errors
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Responsive design verified
- [ ] Accessibility basics checked (keyboard nav, labels)
- [ ] Data persistence verified
- [ ] Error handling confirmed

## Success Criteria

The wizard passes testing if:
1. All 5 steps are accessible and functional
2. Data persists correctly between steps
3. No critical bugs that block completion
4. Performance meets targets
5. Responsive design works on all screen sizes
6. Error handling prevents data loss
7. User can complete entire flow successfully

## Post-Test Deliverables

1. **Test Execution Report** with:
   - Summary of results
   - Pass/fail for each test case
   - List of all bugs found
   - Performance metrics
   - Recommendations

2. **Screenshot Package** containing all captured images

3. **Bug Priority List** for development team

4. **Video Recording** of complete wizard flow (optional but helpful)

---

Remember: The goal is to ensure the wizard provides a smooth, error-free experience for users setting up new projects. Be thorough but also think like a real user would.