const getProductDetails = require('./ProductDetailsFetcher');
const ExcelJS = require('exceljs');

const getProductData = (worksheet) => {

    const productData = [];
    worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1 || row.cellCount < 3) {
            return;
        }

        const code = row.getCell(1).text;
        const variant = row.getCell(2).text;
        const url = row.getCell(3).text;

        productData.push({
            'rowIndex': rowNumber,
            'code': code,
            'variant': variant,
            'url': url,
        });
    })

    return productData;
}

const main = async () => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile('./Test.xlsx');

    for (let i = 0; i < workbook.worksheets.length; i++) {
        const currentSheet = workbook.worksheets[i];

        console.log(`Processing sheet: ${currentSheet.name}`);
        
        const productsData = getProductData(currentSheet);
        for (product of productsData) {
            try {
                const productDetails = await getProductDetails(product.url);
                
                const isProductInStock = productDetails.some(sku => sku.stock > 0);
                if (!isProductInStock) {
                    console.log(`Product with code: ${product.code} is out of stock`);
                    currentSheet.getCell(`A${product.rowIndex}`).style = {
                        ...currentSheet.getCell(`A${product.rowIndex}`).style,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'e06666' }
                        }
                    };
                } else {
                    const cellValue = productDetails.map(sku => `${sku.size}[${sku.stock}]`).join(', ');
                    currentSheet.getCell(`D${product.rowIndex}`).value = cellValue;

                    currentSheet.getCell(`A${product.rowIndex}`).style = {
                        ...currentSheet.getCell(`A${product.rowIndex}`).style,
                        fill: {
                            type: 'pattern',
                            pattern: 'solid',
                            fgColor: { argb: 'FFFFFF' }
                        }
                    };
                }
            } catch (error) {
                console.log(error);
                console.log("Could not fetch the details for product with code: " + product.code + " " + product.url);
            }
        }

        console.log(`Finished processing sheet: ${currentSheet.name}`);
    }

    await workbook.xlsx.writeFile('./Test.xlsx');
}

main();