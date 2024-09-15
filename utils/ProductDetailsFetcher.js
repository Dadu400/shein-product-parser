const puppeteer = require('puppeteer');
const cookies = require('./Cookies.json');

const getProductIdFromLink = (link) => {
    const regex = /\d{5,}/;
    const match = link.match(regex);
    if (match) {
        return match[0];
    }
    return null;
}

const getProductDetails = async (link) => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Workaround for not being detected as a bot
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0 Safari/537.36');
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setGeolocation({ latitude: 47.974420, longitude: 33.422920 });
    await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
            get: () => false,
        });
    });


    let response = 'INVALID';
    // Extract the product details from the response
    page.on('response', async interceptedResponse => {
        if (interceptedResponse.url().includes('productInfo/attr/get')) {
            const jsonResponse = await interceptedResponse.json();
            response = jsonResponse;
        }
    });

    // Set Cookies and go to page
    await page.setCookie(...cookies);
    await page.goto(link, { waitUntil: 'networkidle2' })
    await browser.close();

    // Parse data
    const productId = getProductIdFromLink(link);
    return response['info']['sale_attr_list'][productId]['sku_list'].map(sku => {
         return {
            stock: sku['stock'],
            size: sku['sku_sale_attr'][0]['attr_value_name']
        }
    });
};

module.exports = getProductDetails;