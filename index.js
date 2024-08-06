    import Puppeteer from "./Puppeteer.js";

    const search = "queen historia 1170";
    const browser = new Puppeteer();
    await browser.init();
    
    const funkosValues = new Map();
    const funkosDescartados = new Map();

    try {
        await Promise.all(Array(5).fill().map(async () => {
            const page = await browser.newPage(search);
            const funkoList = await browser.evaluatePatrocinadosSuperior(page);
            await browser.closePage(page);

            funkoList.forEach(f => {
                if(search.toLowerCase().split(' ').some(s => f.name?.toLowerCase().includes(s.toLowerCase())))
                    funkosValues.set(f.name, f)
                else
                    funkosDescartados.set(f.name, f)
            });
        }));
    } catch (error) {
        console.error('Error en la ejecución principal:', error);
    } finally {
        await browser.close();
    }

    funkosValues.forEach(f => console.log(f));
    console.log('Descartados:', funkosDescartados.size);
    funkosDescartados.forEach(f => console.log(f));

