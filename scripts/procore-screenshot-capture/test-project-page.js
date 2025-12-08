import { chromium } from 'playwright';

const testProjectPage = async () => {
  console.log('Testing project page dynamic titles...');
  
  const browser = await chromium.launch({
    headless: false,
    slowMo: 300
  });
  
  const context = await browser.newContext();
  const page = await context.newPage();
  
  try {
    // First, go to the main projects page to see what projects are available
    console.log('\n🧪 Test 1: Navigating to projects list...');
    await page.goto('http://localhost:3000/company/home', {
      waitUntil: 'networkidle',
      timeout: 15000
    });
    
    // Wait for the projects table to load
    await page.waitForSelector('table', { timeout: 5000 });
    
    // Get all project links
    const projectLinks = await page.$$eval('table tbody tr', rows => {
      return rows.map(row => {
        const link = row.querySelector('a[href*="/company/home/"]');
        const cells = row.querySelectorAll('td');
        if (link && cells.length > 1) {
          return {
            href: link.getAttribute('href'),
            name: cells[0].textContent.trim(),
            projectNumber: cells[1].textContent.trim()
          };
        }
        return null;
      }).filter(Boolean);
    });
    
    console.log(`✅ Found ${projectLinks.length} projects`);
    
    if (projectLinks.length > 0) {
      // Test the first project
      const firstProject = projectLinks[0];
      console.log(`\n🧪 Test 2: Testing project: ${firstProject.projectNumber} - ${firstProject.name}`);
      
      // Navigate to the project page
      await page.goto(`http://localhost:3000${firstProject.href}`, {
        waitUntil: 'networkidle',
        timeout: 15000
      });
      
      // Wait for the page to load completely
      await page.waitForSelector('h1', { timeout: 5000 });
      
      // Check the document title
      const pageTitle = await page.title();
      console.log(`📄 Document title: ${pageTitle}`);
      
      // Check the h1 title
      const h1Title = await page.$eval('h1', el => el.textContent.trim());
      console.log(`📝 H1 title: ${h1Title}`);
      
      // Take a screenshot
      await page.screenshot({ 
        path: `outputs/screenshots/project-${firstProject.href.split('/').pop()}-test.png`,
        fullPage: true 
      });
      console.log(`📸 Screenshot saved`);
      
      // Verify the title is dynamic (not the hardcoded Goodwill Bart)
      if (!h1Title.includes('24-104 - Goodwill Bart') || h1Title === firstProject.projectNumber + ' - ' + firstProject.name) {
        console.log('✅ Project title is dynamic!');
      } else {
        console.log('❌ Project title appears to be hardcoded');
      }
      
      // Test another project if available
      if (projectLinks.length > 1) {
        const secondProject = projectLinks[1];
        console.log(`\n🧪 Test 3: Testing another project: ${secondProject.projectNumber} - ${secondProject.name}`);
        
        await page.goto(`http://localhost:3000${secondProject.href}`, {
          waitUntil: 'networkidle',
          timeout: 15000
        });
        
        await page.waitForSelector('h1', { timeout: 5000 });
        
        const secondPageTitle = await page.title();
        const secondH1Title = await page.$eval('h1', el => el.textContent.trim());
        
        console.log(`📄 Document title: ${secondPageTitle}`);
        console.log(`📝 H1 title: ${secondH1Title}`);
        
        if (secondH1Title !== h1Title) {
          console.log('✅ Different projects show different titles - dynamic loading confirmed!');
        } else {
          console.log('❌ Both projects show the same title - might be using mock data');
        }
      }
    } else {
      console.log('⚠️  No projects found in the table');
    }
    
  } catch (error) {
    console.error('\n❌ Error during testing:', error.message);
    
    // Take error screenshot
    await page.screenshot({ 
      path: 'outputs/screenshots/project-page-error.png',
      fullPage: true 
    });
    console.log('📸 Error screenshot saved');
  }
  
  await browser.close();
  console.log('\n🏁 Project page tests completed');
};

// Run the tests
testProjectPage().catch(console.error);