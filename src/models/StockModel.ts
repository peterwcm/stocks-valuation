import axios from 'axios';

const url = 'http://localhost:3000/api/stocks/';

class StockModel {
  static getStocks() {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => {
          resolve(
            res.data.map((stock: any) => ({
              symbol: stock.symbol,
              ask: stock?.summaryDetail?.ask?.raw || null,
              name: stock?.price?.longName || null,
              marketCap: stock?.summaryDetail?.marketCap?.raw || null,
              priceToEarnings: stock?.summaryDetail?.trailingPE?.raw || null,
              priceToBook: stock?.defaultKeyStatistics?.priceToBook?.raw || null,
              priceToCash: stock?.summaryDetail?.ask?.raw / stock?.financialData?.totalCashPerShare?.raw || null,
              priceToSales: stock?.summaryDetail?.priceToSalesTrailing12Months?.raw || null,
              quickRatio: stock?.financialData?.quickRatio?.raw || null,
              currentRatio: stock?.financialData?.currentRatio?.raw || null,
              debtToEquity: stock?.financialData?.debtToEquity?.raw || null,
              dividendYield: stock?.summaryDetail?.dividendYield?.raw || null,
              createdAt: new Date(stock.createdAt)
            }))
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  // static addStock(text: string) {
  //   return axios.post(url, {
  //     text
  //   });
  // }

  // static deleteStock(id: string) {
  //   return axios.delete(`${url}${id}`);
  // }
}

export default StockModel;
