// Accessibility testing configuration

export const a11yConfig = {
  // WCAG compliance levels to test
  tags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'],
  
  // Specific rules configuration
  rules: {
    // Ensure color contrast meets WCAG AA standards
    'color-contrast': { enabled: true },
    
    // Ensure all images have alt text
    'image-alt': { enabled: true },
    
    // Ensure form labels are properly associated
    'label': { enabled: true },
    
    // Ensure headings are in logical order
    'heading-order': { enabled: true },
    
    // Ensure links have discernible text
    'link-name': { enabled: true },
    
    // Ensure page has a main landmark
    'landmark-one-main': { enabled: true },
    
    // Ensure buttons have accessible names
    'button-name': { enabled: true },
    
    // Ensure form elements have labels
    'label-title-only': { enabled: false }, // Allow title attribute as fallback
    
    // Ensure ARIA roles are valid
    'aria-roles': { enabled: true },
    
    // Ensure ARIA attributes are valid
    'aria-valid-attr': { enabled: true },
    'aria-valid-attr-value': { enabled: true },
    
    // Ensure interactive elements are keyboard accessible
    'keyboard-access': { enabled: true },
    
    // Ensure focus indicators are visible
    'focus-visible': { enabled: true }
  },
  
  // Elements to exclude from testing (if they have known issues)
  exclude: [
    // Exclude third-party components with known issues
    '.mantine-RichTextEditor', // Rich text editor may have complex ARIA
    '[data-radix-popper-content-wrapper]', // Radix UI poppers handle ARIA internally
  ],
  
  // Custom checks for specific requirements
  customChecks: {
    // Check for skip navigation links
    skipLinks: {
      selector: 'a[href^="#"]',
      message: 'Page should have skip navigation links'
    },
    
    // Check for proper focus management
    focusManagement: {
      selector: '[tabindex="-1"]:not([aria-hidden="true"])',
      message: 'Elements with tabindex=-1 should be properly managed'
    },
    
    // Check for touch target sizes (44x44 minimum)
    touchTargets: {
      selector: 'button, a, input, select, textarea',
      minSize: 44,
      message: 'Interactive elements should have minimum 44px touch targets'
    }
  }
};

// Helper function to format violations for reporting
export function formatViolation(violation: any) {
  return {
    rule: violation.id,
    impact: violation.impact,
    description: violation.description,
    help: violation.help,
    helpUrl: violation.helpUrl,
    nodes: violation.nodes.map((node: any) => ({
      html: node.html,
      target: node.target,
      failureSummary: node.failureSummary
    }))
  };
}

// Helper to generate accessibility score
export function calculateA11yScore(violations: any[]) {
  let score = 100;
  
  violations.forEach(violation => {
    switch (violation.impact) {
      case 'critical':
        score -= 15;
        break;
      case 'serious':
        score -= 10;
        break;
      case 'moderate':
        score -= 5;
        break;
      case 'minor':
        score -= 2;
        break;
    }
  });
  
  return Math.max(0, score);
}

// Common accessibility test scenarios
export const a11yScenarios = {
  // Keyboard navigation test
  keyboardNav: async (page: any) => {
    // Tab through all interactive elements
    const interactiveElements = await page.$$('button, a, input, select, textarea, [tabindex="0"]');
    
    for (let i = 0; i < interactiveElements.length; i++) {
      await page.keyboard.press('Tab');
      // Check if element has focus
      const hasFocus = await page.evaluate(() => {
        return document.activeElement !== document.body;
      });
      if (!hasFocus) {
        throw new Error(`Element ${i} is not keyboard accessible`);
      }
    }
  },
  
  // Screen reader announcement test
  screenReaderTest: async (page: any) => {
    // Check for ARIA live regions
    const liveRegions = await page.$$('[aria-live], [role="alert"], [role="status"]');
    return liveRegions.length > 0;
  },
  
  // Form validation announcement test
  formValidationTest: async (page: any, formSelector: string) => {
    // Submit invalid form
    const form = await page.$(formSelector);
    if (form) {
      await form.evaluate((f: any) => f.submit());
      
      // Check for ARIA error messages
      const errorMessages = await page.$$('[role="alert"], [aria-invalid="true"]');
      return errorMessages.length > 0;
    }
    return false;
  },
  
  // Focus trap test for modals
  focusTrapTest: async (page: any, modalSelector: string) => {
    const modal = await page.$(modalSelector);
    if (modal) {
      // Get all focusable elements in modal
      const focusableElements = await modal.$$('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      
      if (focusableElements.length > 0) {
        // Focus first element
        await focusableElements[0].focus();
        
        // Tab through all elements
        for (let i = 0; i < focusableElements.length; i++) {
          await page.keyboard.press('Tab');
        }
        
        // Should wrap back to first element
        const activeElement = await page.evaluate(() => document.activeElement);
        const firstElement = await focusableElements[0].evaluate((el: any) => el);
        
        return activeElement === firstElement;
      }
    }
    return false;
  }
};