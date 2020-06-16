const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.uplus.co.kr/css/chgi/chgi/RetrieveTvContentsMFamily.hpi', {waitUntil: 'networkidle2'});
    await page.pdf({path: 'hn.pdf', format : 'A4'});

    console.log('완료');
    await browser.close();
})