import axios from 'axios';

// The local server URL for stocks API.
const url = 'http://localhost:3000/api/stocks';

/**
 * The Stock interface.
 */
interface Stock {
  symbol: string | null;
  name: string;
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
  score: number;
  createdAt: Date | null;
}

/**
 * The Stock model service.
 */
class StockModel {
  /**
   * Retrieve stocks by symbols.
   *
   * @param {Array<string>} watchlist
   *   The list of stock symbols.
   *
   * @return {Promise<Array<Stock>>}
   *   The promise with list of Stock objects.
   */
  static getStocks(watchlist: Array<string>): Promise<Array<Stock>> {
    return new Promise((resolve, reject) => {
      axios
        .post(url, {
          watchlist,
        })
        .then((res) => {
          resolve(res.data.map((data: any) => this.transformStock(data)));
        })
        .catch((err) => {
          const invalidSymbols = err.response.data.invalidSymbols;
          reject({ invalidSymbols });
        });
    });
  }

  /**
   * Refresh a stock.
   *
   * @param {string} symbol
   *   The stock symbol.
   *
   * @return {AxiosPromise}
   *   The axios promise from the update request.
   *
   * @return {Promise<Stock>}
   *   The promise with the Stock object.
   */
  static refreshStock(symbol: string): Promise<Stock> {
    return new Promise((resolve, reject) => {
      axios
        .put(`${url}/refresh`, {
          symbol,
        })
        .then((res) => {
          resolve(this.transformStock(res.data));
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Transform the API stock to a Stock object.
   *
   * @param {any} data
   *   The API stock object.
   *
   * @return {Stock}
   *   The Stock object.
   */
  private static transformStock(data: any): Stock {
    const stock = {
      symbol: data.symbol,
      name: data?.price?.longName || null,
      ask: data?.summaryDetail?.ask?.raw || null,
      marketCap: data?.summaryDetail?.marketCap?.raw || null,
      priceToEarnings: data?.summaryDetail?.trailingPE?.raw || null,
      priceToBook: data?.defaultKeyStatistics?.priceToBook?.raw || null,
      priceToCash: data?.summaryDetail?.ask?.raw / data?.financialData?.totalCashPerShare?.raw || null,
      priceToSales: data?.summaryDetail?.priceToSalesTrailing12Months?.raw || null,
      quickRatio: data?.financialData?.quickRatio?.raw || null,
      currentRatio: data?.financialData?.currentRatio?.raw || null,
      debtToEquity: data?.financialData?.debtToEquity?.raw || null,
      dividendYield: data?.summaryDetail?.dividendYield?.raw || null,
      score: 0,
      createdAt: data?.createdAt,
    };
    stock.score = this.getScore(stock);
    return stock;
  }

  /**
   * Calculate a score of a value based on the given criteria. The larger the value, the better the score is.
   *
   * @param {number|null} val
   *   The value to be checked.
   * @param {number} better
   *   The bottom value of the better range, inclusively.
   * @param {number} best
   *   The upper value of the better range, exclusively, also, the bottom value of the best range, inclusively.
   * @param {number} betterScore
   *   The score for when the value is in the better range.
   * @param {number} bestScore
   *   The score for when the value is in the best range.
   * @param {number} worstScore
   *   The score for when the value is in neither of the range.
   *
   * @return {number}
   *   The score of a value.
   */
  private static upScore(
    val: number | null,
    better: number,
    best: number,
    betterScore: number = 15,
    bestScore: number = 20,
    worstScore: number = -5
  ): number {
    if (!val) return 0;

    if (val >= better && val < best) {
      return betterScore;
    } else if (val >= best) {
      return bestScore;
    } else {
      return worstScore;
    }
  }

  /**
   * Calculate a score of a value based on the given criteria. The smaller the value, the better the score is.
   *
   * @param {number|null} val
   *   The value to be checked.
   * @param {number} better
   *   The upper value of the better range, inclusively.
   * @param {number} best
   *   The bottom value of the better range, exclusively, also, the upper value of the best range, inclusively.
   * @param {number} betterScore
   *   The score for when the value is in the better range.
   * @param {number} bestScore
   *   The score for when the value is in the best range.
   * @param {number} worstScore
   *   The score for when the value is in neither of the range.
   *
   * @return {number}
   *   The score of a value.
   */
  private static downScore(
    val: number | null,
    better: number,
    best: number,
    betterScore: number = 15,
    bestScore: number = 20,
    worstScore: number = -5
  ): number {
    if (!val) return 0;

    if (val <= better && val > best) {
      return betterScore;
    } else if (val <= best) {
      return bestScore;
    } else {
      return worstScore;
    }
  }

  /**
   * Calculate the score of a stock.
   *
   * @param {Stock} stock
   *   The Stock object.
   *
   * @return {number}
   *   The score of the Stock object.
   */
  private static getScore(stock: Stock): number {
    // Ratios of different models.
    const valuationRatio = 1;
    const riskRatio = 0;
    const profitabilityRatio = 0;

    // Scores of different models.
    let valuationScore = 0;
    let riskScore = 0;
    let profitabilityScore = 0;

    // Valuation calucation.
    // PB A) 1 - 0.51 B) <= 0.5
    // PE A) 8 - 5.1 B) <= 5
    // PC A) 4 - 2.1 B) <= 2
    // PS A) 1.5 - 1.1 B) <= 1
    // Yield A) 4% - 6% B) >= 6.1%
    valuationScore += this.downScore(stock.priceToBook, 2, 1);
    valuationScore += this.downScore(stock.priceToEarnings, 10, 8);
    valuationScore += this.downScore(stock.priceToCash, 4, 2);
    valuationScore += this.downScore(stock.priceToSales, 4, 2);
    valuationScore += this.upScore(stock.dividendYield, 0.04, 0.06);

    // Health/Risk calculation.
    riskScore = 0;

    // Profitability calculation.
    profitabilityScore = 0;

    const totalScore =
      valuationScore * valuationRatio + riskScore * riskRatio + profitabilityScore * profitabilityRatio;

    return Math.min(Math.max(totalScore, 0), 100);

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
