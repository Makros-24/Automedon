const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'large-desktop', width: 1920, height: 1080 }
];

async function testDialogResponsiveness() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const viewport of viewports) {
    console.log(`\n📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})...`);

    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height }
    });
    const page = await context.newPage();

    try {
      // Navigate to the page
      console.log('  → Navigating to http://localhost:3001...');
      await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 30000 });

      // Wait for page to load
      console.log('  → Waiting for page to load...');
      await page.waitForTimeout(2000);

      // Scroll to Work section
      console.log('  → Scrolling to Work section...');
      await page.evaluate(() => {
        const workSection = document.querySelector('#work');
        if (workSection) {
          workSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
      await page.waitForTimeout(1000);

      // Find and click the first "See more" button
      console.log('  → Looking for "See more" button...');
      const seeMoreButton = await page.locator('button:has-text("See more")').first();
      await seeMoreButton.waitFor({ state: 'visible', timeout: 10000 });

      console.log('  → Clicking "See more" button...');
      await seeMoreButton.click();

      // Wait for dialog to open
      console.log('  → Waiting for dialog to open...');
      await page.waitForTimeout(1000);

      // Find the dialog element
      const dialog = await page.locator('[role="dialog"]').first();
      await dialog.waitFor({ state: 'visible', timeout: 5000 });

      // Get dialog dimensions
      const dialogBox = await dialog.boundingBox();
      console.log(`  → Dialog dimensions: ${Math.round(dialogBox.width)}x${Math.round(dialogBox.height)}px`);

      // Take screenshot
      const screenshotName = `dialog-${viewport.name}-${viewport.width}px.png`;
      const screenshotPath = path.join(__dirname, screenshotName);

      console.log(`  → Taking screenshot: ${screenshotName}`);
      await page.screenshot({
        path: screenshotPath,
        fullPage: false
      });

      results.push({
        viewport: viewport.name,
        viewportSize: `${viewport.width}x${viewport.height}`,
        dialogSize: `${Math.round(dialogBox.width)}x${Math.round(dialogBox.height)}`,
        screenshot: screenshotName,
        success: true
      });

      console.log(`  ✅ Success!`);

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
      results.push({
        viewport: viewport.name,
        viewportSize: `${viewport.width}x${viewport.height}`,
        error: error.message,
        success: false
      });
    }

    await context.close();
  }

  await browser.close();

  return results;
}

(async () => {
  console.log('🎭 Starting Dialog Responsiveness Test\n');
  console.log('=' .repeat(60));

  const results = await testDialogResponsiveness();

  console.log('\n' + '='.repeat(60));
  console.log('\n📊 TEST SUMMARY\n');

  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.viewport.toUpperCase()}`);
    console.log(`   Viewport: ${result.viewportSize}`);

    if (result.success) {
      console.log(`   Dialog Size: ${result.dialogSize}`);
      console.log(`   Screenshot: ${result.screenshot}`);
      console.log(`   Status: ✅ Success`);
    } else {
      console.log(`   Status: ❌ Failed - ${result.error}`);
    }
    console.log('');
  });

  // Save results to JSON
  const jsonPath = path.join(__dirname, 'dialog-responsiveness-results.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`📄 Detailed results saved to: dialog-responsiveness-results.json\n`);

  process.exit(0);
})();
