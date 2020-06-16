const puppeteer = require('puppeteer');
const { Schedule } = require('./models');

(async () => {
    console.log('크롤링 시작');
    const browser = await puppeteer.launch({headless : false});
    const page = await browser.newPage();
    
    await page.goto('https://www.uplus.co.kr/css/chgi/chgi/RetrieveTvContentsMFamily.hpi', {waitUntil : "networkidle2"});

    const List = [
        ['SBS', 101, `.cboth > li:nth-child(1)`],
        ['KNN', 108, `.cboth > li:nth-child(8)`],
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

    let d = String(new Date());
    let date = d.substr(0,10);
	
    for (obj in List) {
        await page.click(List[obj][2]);
        // await page.waitFor(500);
        let broadcastor = List[obj][0];
        let channel = List[obj][1];

        const infos = await page.evaluate(( { date, broadcastor, channel } ) => {
            const set = [];
            const scheduleRows = document.querySelectorAll('.tblType.list > table > tbody > tr');

            for (const r of scheduleRows) {
                set.push({
                    date,
                    broadcastor,
                    channel,
                    time: r.querySelector('.txtC').innerText.trim(),
                    title: r.querySelector('.txtL').innerText.trim(),
                    limit: r.querySelector('span.tag.cte_all').innerText.trim(),
                    genre: r.querySelector('.txtC.hidden-xs').innerText.trim()
                })
            }
            
            return set;
        }, { date, broadcastor, channel })

        for(let i=0; i<infos.length; i++) {
            console.log('이건 뭔가?', infos[i]);
            Schedule.create({
                date : infos[i].date,
                broadcastor : infos[i].broadcastor,
                channel : infos[i].channel,
                time : infos[i].date +" "+ infos[i].time,
                title : infos[i].title,
                limit : infos[i].limit,
                genre : infos[i].genre
            })
        }

    }

    console.log('ok');
    await browser.close();
})();

/*
sbs ch5

await page.goto('https://www.uplus.co.kr/css/chgi/chgi/RetrieveTvContentsMFamily.hpi', {waitUntil : "networkidle2"});
await page.waitFor(1000);

const schedules = await page.evaluate(() => {
    const set = [];

    const scheduleRows = document.querySelectorAll('.tblType.list > table > tbody > tr');
    
    if (sceheduleRows) {
        for (const row of scheduleRows) {
            set.push({
                time: row.querySelector('.txtC').innerText.trim(),
                title: row.querySelector('.txtL').innerText.trim(),
                limit: row.querySelector('span.tag.cte_all').innerText.trim(),
                genre: row.querySelector('.txtC.hidden-xs').innerText.trim()
            })
        }

        return set;
    }
   
})

console.log('schedules : ',schedules);*/
