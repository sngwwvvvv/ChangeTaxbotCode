const puppeteer = require('puppeteer');
const login = require('./TaxbotLoggin');
const cheerio = require('cheerio');

const getUsers = async (page, number) => {
    await page.goto('https://manager.richntax.com/setting');
    const html = await page.content();
    const $ = cheerio.load(html);
    const users = $("#mainTableUserList > tbody > tr > th:nth-child(3)").map((i, element) => {
        return $(element).text(); 
    }).get();
    return users.filter(user => user.includes(String(number)));
}

module.exports = getUsers;