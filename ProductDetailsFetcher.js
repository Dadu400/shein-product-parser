const getProductIdFromLink = (link) => {
    const regex = /\d{5,}/;
    const match = link.match(regex);
    if (match) {
        return match[0];
    }
    return null;
}

const getProductDetails = async (link) => {
    const productId = getProductIdFromLink(link);

    return await fetch(`https://eur.shein.com/api/productInfo/attr/get?_ver=1.1.8&_lang=en&id=${productId}`, {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "anti-in": "0_1.4.1_99a83f_VKbXZmn1vLxA0WWTJu8ZYw4bpaQ4Yf39S3pZnKS4qHCvlqCNkOC6NUDdZ6O0DVQse_aJt7Hzr6J_sNmPCnmNI9ZPmbbX52GBxni3w9-vBNeu2rYga-_r7bw1QbDH7s3NU-oN5FBy8LImjVF81o6RfQiA_zuVlYDGzmynihAn0kYOg_-pzbP5g5p86VQDI1HpZG6gs52EYdyJwuS0-_h34UQ6Vzh3c87AvH_JrY2Qbme0PmYKmxKSGW8h8eXLiE46zNMBJyBocw8ad5-qsxlL_rAwAvZburXR1laWOy1ctFjfEKnSHobNz7UoZ5ctsskqlvhmeq--iPiQ3bR-0nMZuZCi0UduaC4Bdr5du2ZebGe97jq0ikiNpApEv-HANlouGWIc6hYK_iEQduWc1O482ARG01cPjAiQWRR5SSQzxxT7",
          "armortoken": "T0_2.9.2_0LE2BS71N1FRZsgBdevuegn9Lv1_7s-huMHOugDScR11r5kKe2HO9xqwi1XgMBQpVWN64SxHSscatSodItJJv7FrPCE1uNuuvjOef2kHfMXIl7615lirjuv_qEAvS6Gc907XxD7f7S4ubgQlBBbzElkdmA3bWwNBGGIULOmO3XfSqNV5nTEkr-ByYMecoBiC_1725479899994",
          "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "smdeviceid": "WHJMrwNw1k/EwcBHHYm3xGkMNxBPNCFXc8q25AQZRzUKQKz5UtZFs+RA4KJF31e3hyiQT5bTobsVnuSiF5IyQD9W+wREMMu8XdCW1tldyDzmQI99+chXEiqJaO25LG/C29lCUKKcsmkSXXhqMCMp4ezYmmmXo8LlTkQE5YcNLqNriNYPfoOP/bsQ9vnZx6JjCFRRuSg/X1FURTkAd7H/eWkjd9h7hABCKBcDJwpkqakH3cpSUbC+G0QUDic6AW2yIixSMW2OQhYo=1487582755342",
          "uber-trace-id": "ff5e8db37b25d9a5:ff5e8db37b25d9a5:0:0",
          "x-csrf-token": "OfoNsOrP--dzQ8ZEohDeao2EqCvsoYVUY2e8",
          "x-gw-auth": "a=xjqHR52UWJdjKJ0x6QrCsus66rNXR9@2.0.13&b=1725480246132&d=06942fbc37be6a98b8dee877d03ae8f6&e=TJzysNWFlOTFkMTE2Zjk0MmNkMGI1YzZmODg2ZTE2NjYyZGQxNGZkOTA1NWE1MmEzOGQ3MWFkNDZhM2YzYTI4ZGYyZQ%3D%3D",
          "x-requested-with": "XMLHttpRequest",
          "Referer": link,
          "Referrer-Policy": "no-referrer-when-downgrade"
        },
        "body": null,
        "method": "GET"
      })
    .then(response => response.json())
    .then(data => data['info']['sale_attr_list'][productId]['sku_list'])
    .then(skus => skus.map(sku => {
        return {
            stock: sku['stock'],
            size: sku['sku_sale_attr'][0]['attr_value_name']
        };
    }));
}

module.exports = getProductDetails;
