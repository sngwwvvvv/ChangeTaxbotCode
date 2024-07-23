const puppeteer = require('puppeteer');
const sleeper = require('./TimeSleeper');
const queryString = require('querystring');

const postRequest = async (page, user) => {
    let postData = {
        'searchDropdown': 'managerName',
        'searchDropdownName': '고객담당자',
        'searchInput': user,
        'contStatus': '',
        'contStatusName': '전체',
        'processStep': '',
        'processStepName': '전체',
        'searchDate': '전체',
        'startDate': '',
        'endDate': '',
        'summeryViewYn': 'N'
    }
    try {
        await page.setRequestInterception(true);
        page.once('request', request => {
            const data = {
                'method': 'POST',
                'postData': queryString.stringify(postData),
                'headers': {
                    ...request.headers(),
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            };
            request.continue(data);
            page.setRequestInterception(false);
        });
        await page.goto('https://manager.richntax.com/businessList?page=0&size=100&sort=null&orderBy=null');
    } catch (e) {
        console.error(e);
    }
}

const getBusinessDataList = async (page, user) => {
    await postRequest(page, user);
    const dataList = await page.evaluate(() => {
        return $('.BLT_content > th:nth-child(4) > span > div:nth-child(1) > p').map((i, element) => {
            return $(element).text();
        })
        .get();
    });
    return dataList;
}

const changeBusinessDataCode = async (page, user) => {
    try {
        const dataList = await getBusinessDataList(page, user);
        if (dataList.length) {
            const BLTSelector = 'tbody > tr:nth-child(1) > th:nth-child(4) > span';
            await page.waitForSelector(BLTSelector);
            await page.click(BLTSelector);
            await page.waitForSelector('#memberAgencyUserInfo > th:nth-child(1) > button');
            await page.click('#memberAgencyUserInfo > th:nth-child(1) > button');
            await page.evaluate(() => {
                const a = $('.dropdown-item').filter((i, element) => $(element).text() === '1유경훈(12783)');
                a.click();
                updateBasicInfoSubmit();
                $('#confirm_popup > div > div.popup2-foot > span.pop2-btn.pop2-btn-cnfm').click();
            });
            await sleeper(3);
            await postRequest(page, user);
        }
    } catch (e) {
        console.error(e);
    }
}

module.exports = { postRequest, getBusinessDataList, changeBusinessDataCode };

// (async () => {
//     const browser = await puppeteer.launch({headless:false});
//     const page = await browser.newPage();
//     try {
//         await page.goto('https://manager.richntax.com/', {waitUntil : 'networkidle0'});
//         await login(page);
//         const user = '8이민서';
//         const dataList = await getBusinessDataList(page, user);
//         for (let i = 0; i < dataList.length; i++) {
//             await changeBusinessDataCode(page, user);
//         }
//     }
//     catch (e) {console.error(e);}
//     finally {
//         await browser.close();
//     }
// })();

