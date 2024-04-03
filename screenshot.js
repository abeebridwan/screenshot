const fs = require("fs");
const puppeteer = require("puppeteer");

async function captureMultipleScreenshots(url) {
    if (!fs.existsSync("screenshots")) {
        fs.mkdirSync("screenshots");
    }

    try {
        // Launch headless Chromium browser
        const browser = await puppeteer.launch({ headless: false });
        // Create a new page
        const page = await browser.newPage();

        // set Navigation time to zero
        page.setDefaultNavigationTimeout(0);

        // Set viewport width and height
        await page.setViewport({
            width: 1280, height: 720
        });

        await page.goto(url);

        // Inject JavaScript code into the page to listen for the keypress event
        await page.evaluate(() => {
            document.addEventListener('keypress', (event) => {
                if (event.key === 'o') {
                    const currentDateTime = new Date().toLocaleString();
                    const timeArray = currentDateTime.split(', ');
                    const formattedDate = timeArray[0].replace(/\//g, '-');
                    const formattedTime = timeArray[1].replace(/:/g, '-');
                    const fileName = `${formattedDate}T${formattedTime}`;
                    console.log(`takeScreenshot_${fileName}`)
                }
            });
        });

        // Listen for the console event dispatched by the page
        page.on('console', async (msg) => {
            if (msg.text().split("_")[0] === 'takeScreenshot') {
                const fileName = msg.text().split("_")[1];
                await page.screenshot({ path: `screenshots/${fileName}.webp`, fullPage: false });
                console.log(`\n🎉 Screenshot captured successfully with name: ${fileName}.webp`);
            }
        });
    } catch (err) {
        console.log("❌ Error: ", err.message);
    }
}

// Check if URL is provided as an argument
const url = process.argv[2];
if (!url) {
    console.log("Please provide a URL as a command line argument.");
    process.exit(1);
}

captureMultipleScreenshots(url);
