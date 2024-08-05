import puppeteer from 'puppeteer';

const openBrowser = async () => {
    const browser = await puppeteer.launch({ headless: true, timeout: 60000 });
    return { browser };
}

const closeBrowser = async (browser) => {
    await browser.close();
}

const extraerDatos = () => {
    const funkos = [];
    document.querySelectorAll('.pla-unit').forEach(funko => {
        const web = funko.getAttribute('data-dtld');
        const image = funko.querySelector('.pla-unit-container .pla-unit-img-container img')?.getAttribute('src');
        const link = funko.querySelector('.pla-unit-container a.pla-unit-img-container-link')?.getAttribute('href');
        const name = funko.querySelector('.pla-unit-container .pla-unit-title span')?.innerText;
        const price = funko.querySelector('.pla-unit-container .pla-unit-title')?.nextElementSibling?.querySelector('span')?.innerText;
        const shipping = funko.querySelector('.pla-unit-container .pla-extensions-container > div')?.innerText;
        const stars = funko.querySelector('.pla-unit-container .pla-extensions-container > div')?.nextElementSibling?.querySelector('span > span')?.getAttribute('aria-label')?.replace(/,\s*$/, '');
        const valoraciones = funko.querySelector('.pla-unit-container .pla-extensions-container > div')?.nextElementSibling?.querySelector('span')?.nextElementSibling?.innerText?.replace(/\(|\)/g, '');

        funkos.push({ web, image:'image', link, name, price, shipping, stars, valoraciones });
    });
    return funkos;
}

const funkos = async (browser) => {
    const page = await browser.newPage();

    try {
        await page.goto('https://www.google.com/search?q=funko+queen+historia+1170', { waitUntil: 'domcontentloaded' });
        const funkosList = await page.evaluate(extraerDatos);

        await page.close();
        return funkosList;
    } catch (error) {
        console.error('Error durante la extracción de datos:', error);
        await page.close();
        return [];
    }
}

(async () => {
    const { browser } = await openBrowser();
    const funkosValues = new Map();

    try {
        await Promise.all(Array(5).fill().map(async () => {
            const funkoList = await funkos(browser);
            funkoList.forEach(f => funkosValues.set(f.name, f));
        }));
    } catch (error) {
        console.error('Error en la ejecución principal:', error);
    } finally {
        await closeBrowser(browser);
    }

    funkosValues.forEach(f => console.log(f));
})();
