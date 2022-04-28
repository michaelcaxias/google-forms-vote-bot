import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import { NOME, LINK } from './link-e-nome';

const increaseVotes = () => {
  const votes = fs.readFileSync('numero-de-votos.txt', 'utf8');
  const newVotes = parseInt(votes) + 1;
  console.log(`Numéro do voto: ${newVotes}`);
  fs.writeFileSync('numero-de-votos.txt', newVotes.toString());
}

const navigationPage = async (browser: puppeteer.Browser) => {
  const URL = LINK;
  const page = await browser.newPage();
  console.log('Navigating to page...');
  await page.goto(URL);

  console.log('Waiting for navigation...');
  await page.waitForSelector('.ulDsOb');

  await page.$$eval('.ulDsOb', (options) => { 
    for (const option of options) {
      if (option.textContent === NOME) {
        option.className = 'pessoa-votada';
      } else {
        option.className = 'pessoa-nao-votada';
      }
    }
  });

  console.log('Voting...');
  await page.click('.pessoa-votada');

  await page.screenshot({ path: '/imagens/vote.png' });

  console.log('Submitting...');
  await page.click('.QvWxOd');

  await page.waitForNavigation();
  increaseVotes()
  await page.screenshot({ path: '/imagens/sumitted.png' });
  await page.close();
  console.log('Page closed');
}

const main = async () => {
  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: false,
  });

  for (let index = 0; index < 1000; index += 1) { 
    await navigationPage(browser);
  }

  await browser.close();
};

main()
