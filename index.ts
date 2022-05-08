import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';

const increaseVotes = () => {
  const votes = fs.readFileSync('numero-de-votos.txt', 'utf8');
  const newVotes = parseInt(votes) + 1;
  console.log(`Numéro do voto: ${newVotes}`);
  fs.writeFileSync('numero-de-votos.txt', newVotes.toString());
}

const addClassToOptions = async (optionText: string, page: puppeteer.Page) => {
  await page.$$eval('.ulDsOb', (options, optionSelected) => { 
    for (const option of options) {
      // aqui será o texto da opção que queremos votar (tem que ser entre aspas)
      const NAME = optionSelected;
  
      if (option.textContent === NAME) {
        option.className = 'pessoa-votada';
      } else {
        option.className = 'pessoa-nao-votada';
      }
    }
  }, optionText);
}

const navigationPage = async (browser: puppeteer.Browser, URL: string, option: string) => {
  // aqui será o link do formulário (tem que ser entre aspas)

  const page = await browser.newPage();
  console.log('Abrindo página...');
  await page.goto(URL);
  
  console.log('Esperando a tela carregar...');
  await page.waitForSelector('.ulDsOb');
  
  await addClassToOptions(option, page);

  console.log('Votando em: ' + option);
  await page.click('.pessoa-votada');

  await page.screenshot({ path: './imagens/vote.png' });

  console.log('Clicando no botão "Enviar"...');
  await page.click('.QvWxOd');

  await page.waitForNavigation();
  increaseVotes()
  await page.screenshot({ path: './imagens/sumitted.png' });
  await page.close();
  console.log('Fechando página...');
}

const main = async () => {
  const URL = readlineSync.question('Link do formulário: ');
  const option = readlineSync.question('Nome da pessoa: ');
  const openBrowser = readlineSync.question('Abrir navegador? (s/n): ');
  const votesNumber = readlineSync.question('Número de votos: ');

  const transformAnswerToBool = openBrowser !== 's';

  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: transformAnswerToBool,
  });

  for (let index = 0; index < Number(votesNumber); index += 1) { 
    await navigationPage(browser, URL, option);
  }

  await browser.close();
};

main()
