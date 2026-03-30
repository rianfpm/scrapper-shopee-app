const puppeteer = require("puppeteer");

async function scraperApp(keyword) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(`https://shopee.co.id/search?keyword=${keyword}`, {
        waitUntil: "networkidle2",
    });

    await page.waitForSelector(".shopee-search-item-result__item");

    const products = await page.evaluate(() => {
        const items = document.querySelectorAll(".shopee-search-item-result__item");
        let results = [];

        items.forEach((item) => {
            const name = item.querySelector("._10Wbs-")?.innerText;
            const priceText = item.querySelector("._29R_un")?.innerText;
            const link = item.querySelector("a")?.href;

            if (name && priceText && link) {
                const price = parseInt(priceText.replace(/\D/g, ""));
                results.push({ name, price, priceText, link });
            }
        });

        return results;
    });

    await browser.close();

    return products
        .sort((a, b) => a.price - b.price)
        .slice(0, 3);
}

module.exports = scraperApp;