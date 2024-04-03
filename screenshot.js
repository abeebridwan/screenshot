const fs = require("fs");
const puppeteer = require("puppeteer");

async function captureScreenshots() {
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }
  let browser;
  try {
    // Launch headless Chromium browser
    browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    // Create a new page
    const page = await browser.newPage();

    // set Navigation time to zero
    page.setDefaultNavigationTimeout(0);
    

    // Inject JavaScript code into the page to listen for the keypress event
    await injectKeyPressListener(page);

    // Listen for the 'targetcreated' event to inject JavaScript into any new page or tab
    browser.on('targetcreated', async (target) => {
      if (target.type() === 'page') {
        const newPage = await target.page();
        await injectKeyPressListener(newPage);
      }
    });

  } catch (err) {
    console.log("❌ Error: ", err.message);
    if (browser) {
      await browser.close(); // Close browser in case of error
    }
  }
}

async function injectKeyPressListener(page) {
  // Remove existing event listener
  await page.evaluate(() => {
    document.removeEventListener('keypress', window.keyPressHandler);
  });

  // Check if function is already exposed
  const isFunctionExposed = await page.evaluate(() => {
    return typeof window.takeScreenshot === 'function';
  });

  // If not exposed, inject the takeScreenshot function into the page's context
  if (!isFunctionExposed) {
    await page.exposeFunction('takeScreenshot', async (fileName) => {
      await takeScreenshot(page, fileName);
    });
  }

  // Listen for keypress event
  await page.evaluate(() => {
    window.keyPressHandler = async (event) => {
      console.log("Key pressed:", event.key); // Log the key pressed
      if (event.key === 'o' && !window.isScreenshotInProgress) {
        console.log("O key pressed!"); // Log when 'o' key is pressed
        const currentDateTime = new Date().toLocaleString();
        const timeArray = currentDateTime.split(', ');
        const formattedDate = timeArray[0].replace(/\//g, '-');
        const formattedTime = timeArray[1].replace(/:/g, '-');
        const fileName = `${formattedDate}T${formattedTime}`;
        console.log(`takeScreenshot_${fileName}`);

        // Set the flag to indicate screenshot in progress
        window.isScreenshotInProgress = true;

        // Capture screenshot
        await window.takeScreenshot(fileName);

        // Reset the flag after screenshot capture is completed
        window.isScreenshotInProgress = false;
      }
    };
    document.addEventListener('keypress', window.keyPressHandler);
  });

  // Listen for new pages being created
  page.on('framenavigated', async (frame) => {
    // Inject JavaScript into the newly navigated page
    const newPage = await frame.page();
    if (newPage) {
      await injectKeyPressListener(newPage);
    }
  });
}

// Define takeScreenshot function
async function takeScreenshot(page, fileName) {
  await page.screenshot({ path: `screenshots/${fileName}.png` });
  console.log(`\n🎉 Screenshot captured successfully with name: ${fileName}.webp`);
}

captureScreenshots();
