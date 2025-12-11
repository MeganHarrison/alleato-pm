import { test, expect } from '@playwright/test';

test.describe('Comprehensive Application Screenshots', () => {
  test('capture all major application screens', async ({ page }) => {
    // Home/Dashboard
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/01-home-dashboard.png',
      fullPage: true 
    });
    console.log('✅ Captured Home/Dashboard');

    // Projects Portfolio
    await page.goto('/projects');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Let data load
    await page.screenshot({ 
      path: 'tests/screenshots/02-projects-portfolio.png',
      fullPage: true 
    });
    console.log('✅ Captured Projects Portfolio');

    // Financial - Commitments
    await page.goto('/commitments');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/03-commitments-list.png',
      fullPage: true 
    });
    console.log('✅ Captured Commitments List');

    // Financial - Contracts
    await page.goto('/contracts');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/04-contracts-list.png',
      fullPage: true 
    });
    console.log('✅ Captured Contracts List');

    // Financial - Invoices
    await page.goto('/invoices');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/05-invoices-list.png',
      fullPage: true 
    });
    console.log('✅ Captured Invoices List');

    // Financial - Budget
    await page.goto('/budget');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/06-budget-overview.png',
      fullPage: true 
    });
    console.log('✅ Captured Budget Overview');

    // Financial - Change Orders
    await page.goto('/change-orders');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/07-change-orders.png',
      fullPage: true 
    });
    console.log('✅ Captured Change Orders');

    // Chat RAG Interface
    await page.goto('/chat-rag');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/08-chat-rag-interface.png',
      fullPage: true 
    });
    console.log('✅ Captured Chat RAG Interface');

    // Executive Dashboard
    await page.goto('/executive');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/09-executive-dashboard.png',
      fullPage: true 
    });
    console.log('✅ Captured Executive Dashboard');

    // Documents
    await page.goto('/documents-infinite');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/10-documents-list.png',
      fullPage: true 
    });
    console.log('✅ Captured Documents List');

    // Meetings
    await page.goto('/meetings');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/11-meetings-list.png',
      fullPage: true 
    });
    console.log('✅ Captured Meetings List');

    // Team Chat
    await page.goto('/team-chat');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: 'tests/screenshots/12-team-chat.png',
      fullPage: true 
    });
    console.log('✅ Captured Team Chat');
  });

  test('capture form screens', async ({ page }) => {
    // New Contract Form
    await page.goto('/contracts/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/01-new-contract-form.png',
      fullPage: true 
    });
    console.log('✅ Captured New Contract Form');

    // New Commitment Form
    await page.goto('/commitments/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/02-new-commitment-form.png',
      fullPage: true 
    });
    console.log('✅ Captured New Commitment Form');

    // New Purchase Order Form
    await page.goto('/commitments/purchase-orders/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/03-new-purchase-order-form.png',
      fullPage: true 
    });
    console.log('✅ Captured New Purchase Order Form');

    // New Subcontract Form
    await page.goto('/commitments/subcontracts/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/04-new-subcontract-form.png',
      fullPage: true 
    });
    console.log('✅ Captured New Subcontract Form');

    // New Invoice Form
    await page.goto('/invoices/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/05-new-invoice-form.png',
      fullPage: true 
    });
    console.log('✅ Captured New Invoice Form');

    // New Change Order Form
    await page.goto('/change-orders/new');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/06-new-change-order-form.png',
      fullPage: true 
    });
    console.log('✅ Captured New Change Order Form');

    // Create Project Form
    await page.goto('/create-project');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/07-create-project-form.png',
      fullPage: true 
    });
    console.log('✅ Captured Create Project Form');

    // Create RFI Form
    await page.goto('/create-rfi');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ 
      path: 'tests/screenshots/forms/08-create-rfi-form.png',
      fullPage: true 
    });
    console.log('✅ Captured Create RFI Form');
  });

  test('capture UI interactions', async ({ page }) => {
    // Sidebar Navigation
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to find and expand sidebar sections
    const sidebarTriggers = page.locator('[data-testid*="sidebar"], button:has-text("Financial"), button:has-text("Project Management")');
    if (await sidebarTriggers.count() > 0) {
      await sidebarTriggers.first().click();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ 
      path: 'tests/screenshots/ui/01-sidebar-expanded.png',
      fullPage: true 
    });
    console.log('✅ Captured Sidebar Navigation');

    // Table with Filters
    await page.goto('/commitments');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    // Click on filter button if exists
    const filterButton = page.locator('button:has-text("Filter"), button:has-text("Filters")').first();
    if (await filterButton.count() > 0) {
      await filterButton.click();
      await page.waitForTimeout(500);
    }
    
    await page.screenshot({ 
      path: 'tests/screenshots/ui/02-table-with-filters.png',
      fullPage: true 
    });
    console.log('✅ Captured Table with Filters');

    // Modal/Dialog Example
    await page.goto('/commitments/new');
    await page.waitForLoadState('networkidle');
    
    // Try to trigger a modal (e.g., vendor selection)
    const selectButton = page.locator('button:has-text("Select"), button:has-text("Choose")').first();
    if (await selectButton.count() > 0) {
      await selectButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'tests/screenshots/ui/03-modal-dialog.png',
        fullPage: true 
      });
      console.log('✅ Captured Modal Dialog');
      
      // Close modal
      await page.keyboard.press('Escape');
    }

    // Chat Interface with Message
    await page.goto('/chat-rag');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
    
    const chatInput = page.locator('textarea[placeholder*="message"], textarea[placeholder*="ask"], textarea[placeholder*="type"], input[type="text"][placeholder*="message"]').first();
    if (await chatInput.count() > 0) {
      await chatInput.fill('Show me the latest project updates and any critical issues that need attention.');
      await page.waitForTimeout(500);
      await page.screenshot({ 
        path: 'tests/screenshots/ui/04-chat-with-message.png',
        fullPage: true 
      });
      console.log('✅ Captured Chat with Message');
    }
  });

  test('capture responsive layouts', async ({ page }) => {
    const viewports = [
      { name: 'mobile', width: 375, height: 812 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1920, height: 1080 }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      
      // Dashboard responsive
      await page.goto('/dashboard');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ 
        path: `tests/screenshots/responsive/dashboard-${viewport.name}.png`,
        fullPage: true 
      });
      
      // Projects responsive
      await page.goto('/projects');
      await page.waitForLoadState('networkidle');
      await page.screenshot({ 
        path: `tests/screenshots/responsive/projects-${viewport.name}.png`,
        fullPage: true 
      });
      
      console.log(`✅ Captured ${viewport.name} responsive layouts`);
    }
  });
});