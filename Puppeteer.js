import puppeteer from 'puppeteer'

export default class Puppeteer {
  constructor () {
    this.browser = null
  }

  async init () {
    this.browser = await puppeteer.launch({ headless: true, timeout: 60000 })
  }

  async close () {
    await this.browser.close()
  }

  async newPage (search) {
    const page = await this.browser.newPage()
    await page.goto(`https://www.google.com/search?q=funko+${search}`, { waitUntil: 'domcontentloaded' })
    return page
  }

  async evaluatePatrocinadosSuperior (page) {
    const funkosList = await page.evaluate(() => {
      const funkos = []

      document.querySelectorAll('.pla-unit').forEach(funko => {
        const web = funko.getAttribute('data-dtld')
        const image = funko.querySelector('.pla-unit-container .pla-unit-img-container img')?.getAttribute('src')
        const link = funko.querySelector('.pla-unit-container a.pla-unit-img-container-link')?.getAttribute('href')
        const name = funko.querySelector('.pla-unit-container .pla-unit-title span')?.innerText
        const price = funko.querySelector('.pla-unit-container .pla-unit-title')?.nextElementSibling?.querySelector('span')?.innerText
        const shipping = funko.querySelector('.pla-unit-container .pla-extensions-container > div')?.innerText
        const stars = funko.querySelector('.pla-unit-container .pla-extensions-container > div')?.nextElementSibling?.querySelector('span > span')?.getAttribute('aria-label')?.replace(/,\s*$/, '')
        const valoraciones = funko.querySelector('.pla-unit-container .pla-extensions-container > div')?.nextElementSibling?.querySelector('span')?.nextElementSibling?.innerText?.replace(/\(|\)/g, '')

        funkos.push({ web, image, link, name, price, shipping, stars, valoraciones })
      })

      return funkos
    })

    return funkosList
  }

  async evaluatePatrocinadosLateral (page) {
    const funkosList = await page.evaluate(() => {
      const funkos = []

      document.querySelectorAll('div[data-attrid="kc:/shopping/gpc:organic-offers"] div[role="listitem"]').forEach(funko => {
        const funkoBox = funko.querySelectorAll('a')[0]
        const textos = funkoBox.innerText.split('\n')
        const indexNameNormal = !!textos[2]?.toLowerCase().includes('funko') || !!textos[2]?.toLowerCase().includes('pop')

        const web = textos[0]
        const link = funkoBox.getAttribute('href')
        const name = indexNameNormal ? textos[2] : textos[3]
        const price = textos[1]
        const shipping = indexNameNormal ? textos[4] : null

        funkos.push({ web, link, name, price, shipping })
      })

      return funkos
    })

    return funkosList
  }

  async evaluatePrincipal (page) {
    const funkosList = await page.evaluate(() => {
      const funkos = []

      document.querySelectorAll('div[data-async-context] > div').forEach(funko => {
        const web = funko.querySelectorAll('div.notranslate span') ? funko.querySelectorAll('div.notranslate span')[1]?.innerText : null
        let image = funko.querySelectorAll('a img') ? funko.querySelectorAll('a img')[1]?.getAttribute('src') : null
        image = image === 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==' ? null : image

        const link = funko.querySelector('a')?.getAttribute('href')
        const name = funko.querySelector('h3')?.innerText
        const price = funko.querySelector('div.ChPIuf > span')?.innerText

        funkos.push({ web, image, link, name, price })
      })

      return funkos
    })

    return funkosList
  }

  async closePage (page) {
    await page.close()
  }
}
