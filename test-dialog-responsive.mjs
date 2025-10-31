import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testDialogResponsive() {
  console.log('Starting Playwright test for dialog responsiveness...\n');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    // Navigate to the portfolio page
    console.log('Navigating to http://localhost:3001...');
    await page.goto('http://localhost:3001', { waitUntil: 'networkidle' });
    console.log('✓ Page loaded successfully\n');

    // Wait for the page to be fully loaded
    await page.waitForTimeout(2000);

    // Scroll to the Work section
    console.log('Scrolling to Work section...');
    await page.evaluate(() => {
      document.querySelector('#work')?.scrollIntoView({ behavior: 'smooth' });
    });
    await page.waitForTimeout(1500);

    // Find and click the first "See more" button
    console.log('Looking for "See more" button...');
    const seeMoreButton = await page.locator('button:has-text("See more")').first();

    if (await seeMoreButton.isVisible()) {
      console.log('✓ Found "See more" button, clicking...\n');
      await seeMoreButton.click();
      await page.waitForTimeout(1000);

      // Define screen sizes to test
      const screenSizes = [
        { name: 'Mobile (375px)', width: 375, height: 667 },
        { name: 'Tablet (768px)', width: 768, height: 1024 },
        { name: 'Desktop (1440px)', width: 1440, height: 900 },
        { name: 'Large Desktop (1920px)', width: 1920, height: 1080 }
      ];

      // Take screenshots at different sizes
      for (const size of screenSizes) {
        console.log(`\n📸 Testing ${size.name}...`);

        // Set viewport size
        await page.setViewportSize({ width: size.width, height: size.height });
        await page.waitForTimeout(500);

        // Take screenshot
        const screenshotPath = path.join(__dirname, `dialog-${size.width}px.png`);
        await page.screenshot({
          path: screenshotPath,
          fullPage: false
        });
        console.log(`   ✓ Screenshot saved: dialog-${size.width}px.png`);

        // Log dialog dimensions
        const dialogElement = await page.locator('[role="dialog"]').first();
        if (await dialogElement.isVisible()) {
          const box = await dialogElement.boundingBox();
          if (box) {
            console.log(`   Dialog size: ${Math.round(box.width)}px × ${Math.round(box.height)}px`);
          }
        }
      }

      console.log('\n✅ All screenshots captured successfully!');
      console.log('\nScreenshots saved in project root:');
      console.log('  - dialog-375px.png (Mobile)');
      console.log('  - dialog-768px.png (Tablet)');
      console.log('  - dialog-1440px.png (Desktop)');
      console.log('  - dialog-1920px.png (Large Desktop)');

    } else {
      console.log('❌ "See more" button not found. Make sure the dev server is running.');
    }

  } catch (error) {
    console.error('❌ Error during test:', error.message);
  } finally {
    await browser.close();
    console.log('\n✓ Browser closed');
  }
}

// Run the test
testDialogResponsive().catch(console.error);
