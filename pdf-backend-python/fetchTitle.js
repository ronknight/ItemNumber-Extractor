// fetchTitle.js
const puppeteer = require('puppeteer');

const scrapeProductTitle = async (item) => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  try {
    await page.goto(`https://www.4sgm.com/lsearch.jhtm?cid=&keywords=${item}`);
    const title = await page.$eval('h4.product_name', el => el.innerText.trim());
    await browser.close();
    return title || `Item ${item}`;
  } catch (error) {
    await browser.close();
    console.error(`Error fetching title for item ${item}: ${error}`);
    return `Error fetching title for item ${item}`;
  }
};

// Get the item number from the command-line arguments
const itemNumber = process.argv[2];
scrapeProductTitle(itemNumber).then(title => {
  console.log(title);
  process.exit(0);
});
