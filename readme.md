# Puppeteer Screenshot Capture

This Node.js script captures screenshots of a webpage using Puppeteer. It allows you to specify a URL and captures screenshots when you press a hotkey.

## Prerequisites

- Node.js installed on your system ([Download Node.js](https://nodejs.org/))

## Installation

1. Clone this repository or download the script (`screenshot.js`) directly.

2. Install dependencies by running the following command in your terminal at root of the repo:

```bash
   # If using npm
   npm i

   # If using yarn
   yarn
```

## Usage

1. Run the script using Node.js and provide the URL of the webpage you want to capture screenshots of as a command line argument:

Replace `<URL>` with the URL of the webpage you want to capture screenshots of.

2. Once the script is running, it will open the specified webpage in a headless Chromium browser.

3. Press the designated hotkey to capture a screenshot of the webpage. The default hotkey is `Print Screen` on Windows and `o` on Linux and MacOS.

4. The captured screenshots will be saved in the `screenshots` directory of the project folder with filenames in the format `game-<number>.webp`.

5. To exit the script, press `Ctrl + C`.

## Example

To capture screenshots of the webpage `https://shellshock.io`, run the following command:

```
node screenshot.js https://shellshock.io

wait until see the following text for complete loading:

Press `Print Screen` or `o` to take a screenshot of the game.

Whenever you are ready take a screenshot: Press `Print Screen` or `o`
```
