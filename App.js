const getProductDetails = require('./ProductDetailsFetcher');
const XLSX = require('xlsx');

const getProductData = () => {
    const productData = [];

    const workbook = XLSX.readFile('./Test.xlsx');
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    for (let i = 1; i < rows.length; i++) {
        productData.push({
            'code': rows[i][0],
            'variant': rows[i][1],
            'url': rows[i][2]
        });
    }

    return productData;
}

const main = async () => {
    const productsData = getProductData();

    for (let i = 0; i < productsData.length; i++) {
        const singleProduct = productsData[i];
        try {
            const productDetails = await getProductDetails(singleProduct.url);
            
            const isProductInStock = productDetails.some(sku => sku.stock > 0);
            if (!isProductInStock) {
                console.log(`Product with code: ${singleProduct.code} is out of stock`, productDetails);
            } else {
                const excelRow = i + 1;
                console.log(`Product with code: ${singleProduct.code} is in stock. Row: ${excelRow}`, productDetails);
            }
        } catch (error) {
            console.log("Could not fetch the details for product with code: " + singleProduct.code);
        }
    }
}

main();