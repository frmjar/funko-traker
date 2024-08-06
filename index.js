import Puppeteer from './Puppeteer.js'

const search = 'queen historia 1170'
const browser = new Puppeteer()
await browser.init()

const funkosValues = new Map()
const funkosDescartados = new Map()

const organiceFunkos = (funkosList, funkosValues, funkosDescartados) => {
  funkosList.forEach(f => {
    if (f.web?.toLowerCase().includes('idealo') || f.web?.toLowerCase().includes('globerada')) return

    if (search.toLowerCase().split(' ').some(s => f.name?.toLowerCase().includes(s.toLowerCase()))) {
      funkosValues.set(f.name, f)
    } else {
      funkosDescartados.set(f.name, f)
    }
  })
}

try {
  await Promise.all(Array(5).fill().map(async () => {
    const page = await browser.newPage(search)

    const funkoLists = await Promise.all([
      browser.evaluatePatrocinadosSuperior(page),
      browser.evaluatePatrocinadosLateral(page),
      browser.evaluatePrincipal(page)
    ])

    await browser.closePage(page)

    funkoLists.forEach(funkoList => organiceFunkos(funkoList, funkosValues, funkosDescartados))
  }))
} catch (error) {
  console.error('Error en la ejecución principal:', error)
} finally {
  await browser.close()
}

funkosValues.forEach(f => console.log(f))
console.log('Descartados:')
funkosDescartados.forEach(f => console.log(f))
