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

        funkos.push({ web, image: 'image', link, name, price, shipping, stars, valoraciones })
      })

      return funkos
    })

    return funkosList
  }

  async closePage (page) {
    await page.close()
  }
}
