import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as readlineSync from 'readline-sync';
import * as colors from 'colors';

const increaseVotes = () => {
  const votes = fs.readFileSync('numero-de-votos.txt', 'utf8');
  const newVotes = parseInt(votes) + 1;
  console.log(colors.rainbow('====================') + colors.white(` Voto: ${newVotes} `) + colors.rainbow('===================='));
  fs.writeFileSync('numero-de-votos.txt', newVotes.toString());
}

const addClassToOptions = async (optionText: string, page: puppeteer.Page) => {
  await page.$$eval('.ulDsOb', (options, optionSelected) => { 
    for (const option of options) {
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
  const page = await browser.newPage();
  try {    
    console.log(colors.bold.green('Abrindo pagina...'));
    await page.goto(URL);
    
    console.log(colors.bold.green('Esperando a tela carregar...'));
    await page.waitForSelector('.ulDsOb');
    
    await addClassToOptions(option, page);
  
    console.log(colors.bold.green(`Votando em "${option}"`));
    await page.click('.pessoa-votada');
  
    await page.screenshot({ path: './imagens/vote.png' });
  
    console.log(colors.bold.green('Clicando no botão "Enviar"...'));
    await page.click('.QvWxOd');
  
    await page.waitForNavigation();
    increaseVotes()
  
    await page.screenshot({ path: './imagens/sumitted.png' });
    await page.close();

    console.log(colors.bold.green('Fechando página...'));
  } catch (error) {
    console.log(colors.bold.red('Algo deu errado, reiniciando programa...'));
    await page.close();
  }
}

const main = async () => {
  const URL = readlineSync.question(colors.bold.yellow('Link do formulario: '));
  const option = readlineSync.question(colors.bold.yellow('Nome da pessoa: '));
  const openBrowser = readlineSync.question(colors.bold.yellow('Abrir navegador? (s/n): '));
  const votesNumber = readlineSync.questionInt(colors.bold.yellow('Numero de votos: '));
  console.log(' ');

  const transformAnswerToBool = openBrowser !== 's';

  const browser: puppeteer.Browser = await puppeteer.launch({
    headless: transformAnswerToBool,
  });

  for (let index = 0; index < votesNumber; index += 1) {
    await navigationPage(browser, URL, option);
  }

  await browser.close();
};

main()
