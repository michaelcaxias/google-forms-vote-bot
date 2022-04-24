import puppeteer from 'puppeteer';
import fs from 'fs';

const increaseVotes = () => {
  const votes = fs.readFileSync('votes.txt', 'utf8');
  const newVotes = parseInt(votes) + 1;
  console.log(newVotes);
  fs.writeFileSync('votes.txt', newVotes.toString());
}

const navigationPage = async (browser: puppeteer.Browser, index: number) => {
  console.log(`---------- ${index} ----------`);
  const URL = `https://surveyheart.com/form/625213cf4cd68f10e838edda`
  const page = await browser.newPage();
  console.log('Navigating to page...');
  await page.goto(URL);

  await page.click('#Iniciar');
  console.log('Clicked on button to start survey');
  await page.click('.mdc-radio__native-control');
  console.log('Voted for "Henrique"');
  await page.click('#Submit');
  console.log('Submitted form');
  const waitRequest = await page.waitForRequest('https://surveyheart.com/response');
  console.log(`Request method: ${waitRequest.method()}`);
  console.log('Form submitted');

  await page.screenshot({ path: 'example.png' });
  await page.close();
  increaseVotes();
  console.log('Page closed');
}

const main = async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: true,
  });
  for (let index = 0; index <= 10000; index += 1) {
    await navigationPage(browser, index);
  }

  await browser.close();
};

main()
