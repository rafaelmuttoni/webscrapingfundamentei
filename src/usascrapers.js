const puppeteer = require('puppeteer')
const readline = require('readline-sync')

const scrapeAtivo = async () => {
  // Email e senha

  const user = {}

  user.email = askEmail()
  user.password = askPassword()

  console.log('If your info is correct you should see the result in about ~1min')

  // Perguntar e-mail e senha

  function askEmail() {
    return readline.question('Type an e-mail: ')
  }

  function askPassword() {
    return readline.question('Type your password: ')
  }

  // Abrir browser e navegar para a pagina

  const browser = await puppeteer.launch( { headless: true } );
  const page = await browser.newPage();

  await page.goto('https://fundamentei.com/login')

  // Login

  await page.type('[name=email]', user.email)

  await page.type('[name=password]', user.password)

  await page.click('[type=submit]')

  await page.waitFor(5000)

  // Selecionar US Companies

  for (i = 0; i < 10; i ++) {
    await page.keyboard.press('Tab')
    await page.waitFor(200)
  }

  await page.keyboard.press('Space')
  await page.waitFor(200)
  await page.keyboard.press('ArrowDown')
  await page.waitFor(200)
  await page.keyboard.press('Enter')
  await page.waitFor(2000)

  // Carregar toda página

  for (i = 0; i < 26; i++) {
    await page.keyboard.press('Tab')
    await page.waitFor(200)
  }
  

  for (i = 0; i < 16; i++) {
    await page.keyboard.press('Space')
    await page.waitFor(1000)
  }
  

  // Cria array de codigos dos ativos


  const codigosAtivos = await page.$$eval('.css-1rvjs5a', ativo => ativo.map(ativo => ativo.textContent));


  for (i = 0; codigosAtivos.length; i++) {
    await page.goto(`https://fundamentei.com/us/${codigosAtivos[i]}`)
    // NOTA ATIVO
    const [notaEl] = await page.$$('.css-v0mgew')
    const notaProp = await notaEl.getProperty('textContent')
    const nota = await notaProp.jsonValue()
    // NUM AVALIACOES
    const [numEl] = await page.$$('.css-1tah0o2')
    const numProp = await numEl.getProperty('textContent')
    const numAvaliacoes = await numProp.jsonValue()
    // CRIA OBJETO COM NOME ATIVO, NOTA E NUM DE AVALIACOES E LOGA
    const object = {nome: codigosAtivos[i], nota, numAvaliacoes}
    console.log(object)
  }


  browser.close()
}

scrapeAtivo()