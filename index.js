import puppeteer from 'puppeteer';

const funkos = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.google.com/search?q=Funko+Pop+Harry+Potter+Buckbeak+123');

    const funkos = await page.evaluate(() => {
        const funkos = [];

        document.querySelectorAll('.top-pla-group-inner .pla-unit').forEach(funko => {
            const web = funko.getAttribute('data-dtld');
            const image = funko.querySelector('.pla-unit-container .pla-unit-img-container img')?.getAttribute('src');
            const link = funko.querySelector('.pla-unit-container a.pla-unit-img-container-link')?.getAttribute('href');
            const name = funko.querySelector('.pla-unit-container .pla-unit-title span')?.innerText;
            const price = funko.querySelector('.pla-unit-container .pla-unit-title')?.nextElementSibling.querySelector('span')?.innerText;
            const shipping = funko.querySelector('.pla-unit-container .pla-extensions-container >div')?.innerText;
            const stars = funko.querySelector('.pla-unit-container .pla-extensions-container >div')?.nextElementSibling?.querySelector('span > span')?.getAttribute('aria-label').replace(/,\s*$/, '');
            const valoraciones = funko.querySelector('.pla-unit-container .pla-extensions-container >div')?.nextElementSibling?.querySelector('span')?.nextElementSibling?.innerText?.replace(/\(|\)/g, '');

            funkos.push({web, image: 'image', link, name, price, shipping, stars, valoraciones });
        });
        
        return funkos;
    });
    await browser.close();
    return funkos;

    }

funkos().then(console.log);