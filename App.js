const getProductDetails = require('./utils/ProductDetailsFetcher');
const ExcelJS = require('exceljs');
const chokidar = require('chokidar');

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

const processDocument = async (filePath) => {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    for (let i = 0; i < workbook.worksheets.length; i++) {
        const currentSheet = workbook.worksheets[i];

        console.log('\n------------------------------------------');
        console.log(`Processing sheet: ${currentSheet.name}`);
        
        const productsData = getProductData(currentSheet);
        console.log('Total products to process: ' + productsData.length);
        console.log('------------------------------------------');
        for (product of productsData) {
            try {
                const productDetails = await getProductDetails(product.url);
                
                const inStockCellValue = productDetails.filter(sku => sku.stock > 10 && sku.stock != 0)
                    .map(sku => `${sku.size}[${sku.stock}]`)
                    .join(', ');
                const inLowStockCellValue = productDetails.filter(sku => sku.stock <= 10 && sku.stock != 0)
                    .map(sku => `${sku.size}[${sku.stock}]`)
                    .join(', ');
                const soldOutCellValue = productDetails.filter(sku => sku.stock === 0)
                    .map(sku => `${sku.size}[${sku.stock}]`)
                    .join(', ');

                currentSheet.getCell(`D${product.rowIndex}`).value = inStockCellValue;
                currentSheet.getCell(`E${product.rowIndex}`).value = soldOutCellValue;
                currentSheet.getCell(`F${product.rowIndex}`).value = inLowStockCellValue;

                const isAllSoldOut = productDetails.every(sku => sku.stock === 0);
                if (isAllSoldOut) {
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
                    console.log(`Product with code: ${product.code} is in stock`);
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
        console.log('------------------------------------------');
    }

    const resultFilePath = filePath.replace('monitoring', 'result');
    await workbook.xlsx.writeFile(resultFilePath);
}

const watchFolder = './monitoring';

console.log(`Started listening to monitoring folder, please add files to start the Shein data fetching`);
chokidar.watch(watchFolder).on('add', async (filePath) => {
    console.log(`------------------------------------------`);
    console.log('Processing file: ' + filePath);
    await processDocument(filePath);
    console.log('Finished processing file');
    console.log(`------------------------------------------`);
});