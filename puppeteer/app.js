const puppeteer = require('puppeteer');
const { Schedule } = require('./models');

(async () => {
    const browser = await puppeteer.launch({headless : true});
    const page = await browser.newPage();
    
    await page.goto('https://www.uplus.co.kr/css/chgi/chgi/RetrieveTvContentsMFamily.hpi', {waitUntil : "networkidle2"});

    const List = [
        ['SBS', 101, `.cboth > li:nth-child(1)`],
        // ['KNN', 108, `.cboth > li:nth-child(8)`],
        ['KBS2', 111, `.cboth > li:nth-child(11)`],
        ['KBS1', 112, `.cboth > li:nth-child(12)`],
        ['MBC', 132, `.cboth > li:nth-child(32)`],
        ['EBS1', 152, `.cboth > li:nth-child(52)`],
        ['EBS2', 158, `.cboth > li:nth-child(58)`],
        ['JTBC', 153, `.cboth > li:nth-child(53)`],
        ['MBN', 154, `.cboth > li:nth-child(54)`],
        ['채널A', 155, `.cboth > li:nth-child(55)`],
        ['TV조선', 156, `.cboth > li:nth-child(56)`],  
    ];

    for (obj in List) {
        await page.click(List[obj][2]);
        await page.waitFor(500);
        await page.click('a.next');
        await page.waitFor(500);

        let dat = await page.evaluate(() => document.querySelector('#todayA').innerText );
        let year = dat.substr(0,4);
        let month = dat.substr(6,2);
        let day = dat.substr(10,2); 

        let broadcastor = List[obj][0];
        let channel = List[obj][1];

        const infos = await page.evaluate(() => {
            const set = [];
            const scheduleRows = document.querySelectorAll('.tblType.list > table > tbody > tr');
            
            for (const r of scheduleRows) {
                set.push({
                    time: r.querySelector('.txtC').innerText.trim(),
                    title: r.querySelector('.txtL').innerText.trim(),
                    limit: r.querySelector('span.tag.cte_all').innerText.trim(),
                    genre: r.querySelector('.txtC.hidden-xs').innerText.trim()
                })
            }
            
            return set;
        });

        for(let i=0; i<infos.length; i++) {
            Schedule.create({
                broadcastor,
                channel,
                time : year+" "+ month+" "+day +" "+ infos[i].time,
                title : infos[i].title,
                limit : infos[i].limit,
                genre : infos[i].genre
            })
        }        
    }

    await browser.close();
})();