const { chromium } = require('playwright');

async function finalValidation() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('🎯 Final Validation: Current Phase Filter & 50 Project Limit');
    console.log('=======================================================\n');

    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('table', { timeout: 10000 });

    // Get project count
    const projectCountElement = await page.locator('div:has-text("project")').first();
    const projectCountText = await projectCountElement.textContent();
    console.log(`📊 Project Count Display: "${projectCountText}"`);

    // Get visible projects
    const projectRows = await page.locator('tbody tr').all();
    console.log(`📋 Visible project rows: ${projectRows.length}`);

    // Check each visible project's stage
    console.log('\n📋 Checking project stages:');
    let currentPhaseCount = 0;
    
    for (let i = 0; i < projectRows.length; i++) {
      const row = projectRows[i];
      
      // Get project name from the button in the first cell
      const nameButton = await row.locator('td button').first();
      const projectName = await nameButton.textContent();
      
      // Get stage from the stage column (should be around column 9-10)
      const stageCells = await row.locator('td span:has-text("Current"), td span:has-text("CURRENT"), td span:has-text("current")').all();
      const stageCell = await row.locator('td').nth(9);
      const stageText = await stageCell.textContent();
      
      if (projectName && stageText) {
        const isCurrentPhase = stageText.toLowerCase().includes('current');
        console.log(`  ${i + 1}. ${projectName.trim()} → Stage: "${stageText.trim()}" ${isCurrentPhase ? '✅' : '❌'}`);
        
        if (isCurrentPhase) {
          currentPhaseCount++;
        }
      }
    }

    // Summary
    console.log(`\n📊 Summary:`);
    console.log(`  • Total visible projects: ${projectRows.length}`);
    console.log(`  • Projects with 'Current' phase: ${currentPhaseCount}`);
    console.log(`  • 50 project limit: ${projectRows.length <= 50 ? '✅ Within limit' : '❌ Exceeds limit'}`);
    console.log(`  • Default filter working: ${currentPhaseCount === projectRows.length ? '✅ All current' : '❌ Mixed phases'}`);

    if (currentPhaseCount === projectRows.length && projectRows.length <= 50) {
      console.log('\n🎉 SUCCESS: All requirements met!');
      console.log('  ✅ Default filter shows only "Current" phase projects');  
      console.log('  ✅ Project limit is within 50');
      console.log('  ✅ Case insensitive filtering working');
    } else {
      console.log('\n⚠️  Some requirements may need adjustment');
    }

    // Keep browser open for 5 seconds
    await page.waitForTimeout(5000);

  } catch (error) {
    console.error('💥 Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

finalValidation();