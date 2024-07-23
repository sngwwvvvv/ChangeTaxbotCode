const puppeteer = require('puppeteer');
const login = require('./TaxbotLoggin');
const getUser = require('./GetUserInfo');
const changeCode = require('./ChangeCode');

async function main () {
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto('https://manager.richntax.com/', {waitUntil : 'networkidle0'});
    try {
        await login(page);
        // 바꿀 영업자코드 가져오는 곳.
        // 숫자 변경 통해 변경대상 영업자들 변경 가능
        const userList = await getUser(page, 8); 
        const userFiltered = userList.filter(user => user !== '8안상호'); //이후 사용시 filter 없애기
        
        for (let user of userFiltered) {
            const businessList = await changeCode.getBusinessDataList(page, user);
            for (let i = 0; i < businessList.length; i++) {
                await changeCode.changeBusinessDataCode(page, user);
            }
        }
    }
    catch (e) {console.error(e);}
    finally {await browser.close();}
}

main();