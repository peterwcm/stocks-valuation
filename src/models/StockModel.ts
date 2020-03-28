import axios from 'axios';

// const url = 'http://localhost:3000/api/stocks/';
const url = '/stocks.json';

interface Stock {
  ask: number | null;
  marketCap: number | null;
  priceToEarnings: number | null;
  priceToBook: number;
  priceToCash: number | null;
  priceToSales: number | null;
  quickRatio: number | null;
  currentRatio: number | null;
  debtToEquity: number | null;
  dividendYield: number | null;
}

class StockModel {
  static getStocks() {
    return new Promise((resolve, reject) => {
      axios
        .get(url)
        .then(res => {
          resolve(
            res.data.map((data: any) => {
              const stock = {
                symbol: data.symbol,
                ask: data?.summaryDetail?.ask?.raw || null,
                name: data?.price?.longName || null,
                marketCap: data?.summaryDetail?.marketCap?.raw || null,
                priceToEarnings: data?.summaryDetail?.trailingPE?.raw || null,
                priceToBook: data?.defaultKeyStatistics?.priceToBook?.raw || null,
                priceToCash: data?.summaryDetail?.ask?.raw / data?.financialData?.totalCashPerShare?.raw || null,
                priceToSales: data?.summaryDetail?.priceToSalesTrailing12Months?.raw || null,
                quickRatio: data?.financialData?.quickRatio?.raw || null,
                currentRatio: data?.financialData?.currentRatio?.raw || null,
                debtToEquity: data?.financialData?.debtToEquity?.raw || null,
                dividendYield: data?.summaryDetail?.dividendYieldata?.raw || null,
                score: 0,
                createdAt: new Date()
              };
              stock.score = this.getScore(stock);

              return stock;
            })
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  private static upScore(
    val: number | null,
    better: number,
    best: number,
    betterScore: number = 15,
    bestScore: number = 20,
    worstScore: number = -5
  ) {
    if (!val) return 0;

    if (val >= better && val < best) {
      return betterScore;
    } else if (val > best) {
      return bestScore;
    } else {
      return worstScore;
    }
  }

  private static downScore(
    val: number | null,
    better: number,
    best: number,
    betterScore: number = 15,
    bestScore: number = 20,
    worstScore: number = -5
  ) {
    if (!val) return 0;

    if (val <= better && val > best) {
      return betterScore;
    } else if (val <= best) {
      return bestScore;
    } else {
      return worstScore;
    }
  }

  private static getScore(stock: Stock) {
    let score = 0;
    // Valuation
    // PB A) 1 - 0.51 B) <= 0.5
    // PE A) 8 - 5.1 B) <= 5
    // PC A) 4 - 2.1 B) <= 2
    // PS A) 1.5 - 1.1 B) <= 1
    // Yield A) 4% - 6% B) >= 6.1%
    score += this.downScore(stock.priceToBook, 2, 1);
    score += this.downScore(stock.priceToEarnings, 10, 8);
    score += this.downScore(stock.priceToCash, 4, 2);
    score += this.downScore(stock.priceToSales, 4, 2);
    score += this.upScore(stock.dividendYield, 0.04, 0.06);

    return Math.min(Math.max(score, 0), 100);

    //   // Health/Risk

    //   // Profitability

    //   // const peRatioMax = 15;
    //   // const pbvRatioMax = 1.5;
    //   // const buyThreshold = 10;

    //   // const stockPrice = this.ask;
    //   // const earningShare = 0;
    //   // const estEarningShare = 0;
    //   // const bookValue = 0;
    //   // if (!estEarningShare || !bookValue) return null;

    //   // const peRatio = stockPrice / estEarningShare;
    //   // const pbvRatio = stockPrice / bookValue;

    //   // const estStockPrice = this.round(estEarningShare * buyThreshold, 2);
    //   // let indicatorScore = this.round(
    //   //   Math.min(
    //   //     Math.max(((estStockPrice - stockPrice) / stockPrice) * 100, -70),
    //   //     70
    //   //   ),
    //   //   0
    //   // );

    //   // // EPS Growth
    //   // if (estEarningShare && estEarningShare > earningShare) {
    //   //   indicatorScore += 10;
    //   // } else if (estEarningShare && estEarningShare < earningShare) {
    //   //   indicatorScore -= 10;
    //   // }
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
