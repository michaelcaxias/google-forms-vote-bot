import * as puppeteer from 'puppeteer';
import * as fs from 'fs';

const increaseVotes = () => {
  const votes = fs.readFileSync('votes.txt', 'utf8');
  const newVotes = parseInt(votes) + 1;
  console.log(newVotes);
  fs.writeFileSync('votes.txt', newVotes.toString());
}

const navigationPage = async (browser: puppeteer.Browser) => {
  const URL = `https://docs.google.com/forms/d/e/1FAIpQLScUkLpWYhDNuKLCcW8rvHg-LgsvdD49LDGvXlZ1ZP0atqzDjw/viewform`
  const page = await browser.newPage();
  console.log('Navigating to page...');
  await page.goto(URL);

  await page.waitForNavigation();

  await page.$$eval('.ulDsOb', (options) => { 
    options.forEach((option) => {
      if (option.textContent === 'Luiz') {
        option.className = 'pessoa-votada';
      } else {
        option.className = 'pessoa-nao-votada';
      }
    });
  });

  await page.click('.pessoa-votada');
  await page.click('.QvWxOd');
  await page.waitForNavigation();

  await page.screenshot({ path: 'example.png' });
  await page.close();
  console.log('Page closed');
}

const main = async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false,
  });

  await navigationPage(browser);

  await browser.close();
};

main()
