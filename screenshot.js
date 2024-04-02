const fs = require("fs");
const puppeteer = require("puppeteer");
const keypress = require('keypress');

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

        let id = 1
        keypress(process.stdin);
        const hotkey = 'o'; // Hotkey for all platforms
        console.log(`Press ${hotkey} to take a screenshot of the game.`); // appears the page loads and ready
        process.stdin.on('keypress', (ch, key) => {
            if (key && key.name == hotkey) {
                page.screenshot({ path: `screenshots/game-${id}.webp`, fullPage: false })
                console.log(`\n🎉 ${id} screenshot captured successfully.`);
                id++
            }
            if (key && key.ctrl && key.name == 'c') {
                process.exit();
            }
        });

        process.stdin.setRawMode(true);
        process.stdin.resume();
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
