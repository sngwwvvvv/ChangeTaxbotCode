const puppeteer = require('puppeteer');
const sleeper = require('./TimeSleeper');
const cheerio = require('cheerio');

const taxbotLogin = async (page) => {
    await page.waitForSelector('#input-email');
    await page.type('#input-email', 'ceo_richntax');
    await page.type('#input-password', 'rich7429!!');
    await page.evaluate(() => {
        login();
    });
    await page.waitForNavigation();
}

module.exports = taxbotLogin;
