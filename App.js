const getProductDetails = require('./ProductDetailsFetcher');
const XLSX = require('xlsx');

const getProductData = (worksheet) => {
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const productData = [];
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
    const workbook = XLSX.readFile('./Test.xlsx');

    const sheetNames = workbook.SheetNames;
    for (let i = 0; i < sheetNames.length; i++) {
        const currentSheetName = sheetNames[i];
        const currentSheet = workbook.Sheets[currentSheetName];

        console.log(`Processing sheet: ${currentSheetName}`);
        
        const productsData = getProductData(currentSheet);
        for (let i = 0; i < productsData.length; i++) {
            const singleProduct = productsData[i];
            try {
                const productDetails = await getProductDetails(singleProduct.url);
                
                const isProductInStock = productDetails.some(sku => sku.stock > 0);
                if (!isProductInStock) {
                    console.log(`Product with code: ${singleProduct.code} is out of stock`);
                } else {
                    const excelRow = i + 2;
                    console.log(`Product with code: ${singleProduct.code} is in stock. Row: ${excelRow}`);
                }
            } catch (error) {
                console.log("Could not fetch the details for product with code: " + singleProduct.code);
            }
        }
    }
}

main();