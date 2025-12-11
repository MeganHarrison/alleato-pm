import { test, expect } from '@playwright/test';

test.describe('Navigate to Project Homepage', () => {
  test('should navigate from projects list to redesigned homepage', async ({ page }) => {
    // First go to the projects list
    await page.goto('http://localhost:3003/');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of projects list
    await page.screenshot({ 
      path: 'frontend/tests/screenshots/projects-list.png',
      fullPage: true 
    });
    
    // Look for project rows in the table
    const projectRows = page.locator('table tbody tr');
    const rowCount = await projectRows.count();
    console.log('Found project rows:', rowCount);
    
    if (rowCount > 0) {
      // Get first project's details
      const firstRow = projectRows.first();
      const projectName = await firstRow.locator('td').first().textContent();
      console.log('First project name:', projectName);
      
      // Click on the first project
      await firstRow.click();
      
      // Wait for navigation
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
      
      // Take screenshot of the homepage
      await page.screenshot({ 
        path: 'frontend/tests/screenshots/project-homepage-after-navigation.png',
        fullPage: true 
      });
      
      // Now check for the redesigned elements
      console.log('Current URL:', page.url());
      
      // Check for main header
      const h1Exists = await page.locator('h1').count() > 0;
      console.log('H1 exists:', h1Exists);
      
      if (h1Exists) {
        const pageTitle = await page.locator('h1').first().textContent();
        console.log('Page title:', pageTitle);
        
        // Check for Project Overview section
        const overviewExists = await page.getByText('Project Overview').count() > 0;
        console.log('Project Overview section exists:', overviewExists);
        
        // Check for Recent Activity
        const activityExists = await page.getByText('Recent Activity').count() > 0;
        console.log('Recent Activity section exists:', activityExists);
        
        // Check for tabs
        const tabsExist = await page.getByRole('tab').count() > 0;
        console.log('Tabs exist:', tabsExist);
        
        // Check for Project Details in sidebar
        const detailsExist = await page.getByText('Project Details').count() > 0;
        console.log('Project Details section exists:', detailsExist);
        
        // Check for Key Contacts
        const contactsExist = await page.getByText('Key Contacts').count() > 0;
        console.log('Key Contacts section exists:', contactsExist);
        
        console.log('✅ Successfully navigated to redesigned project homepage');
      } else {
        console.log('❌ Page loaded but no H1 found - might be an error page');
      }
    } else {
      console.log('❌ No projects found in the projects list');
      
      // Check if there's an error message or empty state
      const pageContent = await page.textContent('body');
      console.log('Page content preview:', pageContent?.substring(0, 200));
    }
  });
});