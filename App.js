const getProductDetails = require('./ProductDetailsFetcher');

const productLinks = [
    { code: 'MN0083', url: 'https://eur.shein.com/Appliques-Trumpet-Sleeve-Belted-Mesh-Sleep-Robe-Without-Lingerie-Set-p-10500060-cat-2211.html?mallCode=1' },
    { code: 'MN0084', url: 'https://eur.shein.com/Layered-Sleeve-Drop-Shoulder-Belted-Satin-Sleep-Robe-p-10995825-cat-2211.html?mallCode=1' },
    { code: 'MN0085', url: 'https://eur.shein.com/Ruffle-Trim-Flounce-Sleeve-Belted-Mesh-Robe-Without-Lingerie-p-11203160-cat-2211.html?mallCode=1' },
    { code: 'MN0086', url: 'https://eur.shein.com/Floral-Jacquard-Flounce-Sleeve-Ruffle-Hem-Belted-Sleep-Robe-Without-Lingerie-Set-p-16228928-cat-2211.html?mallCode=1&imgRatio=3-4' },
    { code: 'MN0087', url: 'https://eur.shein.com/Fuzzy-Trim-Belted-Mesh-Sleep-Robe-Without-Lingerie-p-3374411-cat-2211.html?mallCode=1' },
    { code: 'MN0088', url: 'https://eur.shein.com/Flounce-Sleeve-Ruffle-Hem-Belted-Satin-Robe-p-12162873-cat-2211.html?mallCode=1' },
    { code: 'MN0089', url: 'https://us.shein.com/Flounce-Sleeve-Ruffle-Hem-Belted-Satin-Robe-p-12162873-cat-2202.html' },
    { code: 'MN0090', url: 'https://eur.shein.com/Flounce-Sleeve-Belted-Satin-Robe-p-14190459-cat-2211.html?lang=enpt-pt&ref=www&rep=dir&ret=eur' },
    { code: 'MN0091', url: 'https://eur.shein.com/Contrast-Lace-Trumpet-Sleeve-Belted-Satin-Robe-p-18275675-cat-2211.html?mallCode=1' },
    { code: 'MN0092', url: 'https://eur.shein.com/Floral-Lace-Satin-Belted-Robe-p-809852-cat-2211.html?mallCode=1' },
    { code: 'MN0093', url: 'https://eur.shein.com/Contrast-Mesh-Satin-Robe-Cami-Dress-PJ-Set-p-17823779-cat-1880.html?mallCode=1' },
    { code: 'MN0094', url: 'https://eur.shein.com/Fuzzy-Trim-Belted-Robe-p-13979380-cat-2211.html?mallCode=1' },
    { code: 'MN0095', url: 'https://eur.shein.com/Fuzzy-Cuff-Belted-Satin-Sleep-Robe-p-14322357-cat-2209.html?mallCode=1' }
];

const main = async () => {
    for (const productLink of productLinks) {
        try {
            const productDetails = await getProductDetails(productLink.url);
            
            const isProductInStock = productDetails.some(sku => sku.stock > 0);
            if (!isProductInStock) {
                console.log(`Product with code: ${productLink.code} is out of stock`);
            } else {
                console.log(`Product with code: ${productLink.code} is in stock:`);
                console.log(productDetails);
            }
        } catch (error) {
            console.log("Could not fetch the details for product with code: " + productLink.code);
        }
    }
}

main();