import axios from 'axios';

// The local server URL for stocks API.
const url = 'http://localhost:3000/api/stocks';

/**
 * The Stock Score interface.
 */
interface StockScore {
  valuation: number;
  health: number;
  profitability: number;
  overall: number;
}

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
  revenueGrowth: number | null;
  earningsGrowth: number | null;
  operatingCashflow: number | null;
  netIncomeToCommon: number | null;
  profitMargins: number | null;
  returnOnEquity: number | null;
  score: StockScore;
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
   * Delete a stock.
   *
   * @param {string} symbol
   *   The stock symbol.
   *
   * @return {AxiosPromise}
   *   The axios promise from the delete request.
   *
   * @return {Promise<boolean>}
   *   The promise with the boolean result.
   */
  static deleteStock(symbol: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${url}/delete`, {
          data: {
            symbol,
          },
        })
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(false);
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
      // Yahoo Finance returns a debtToEquity digit in %.
      debtToEquity: data?.financialData?.debtToEquity?.raw / 100 || null,
      dividendYield: data?.summaryDetail?.dividendYield?.raw || null,
      revenueGrowth: data?.financialData?.revenueGrowth?.raw || null,
      earningsGrowth: data?.financialData?.earningsGrowth?.raw || null,
      netIncomeToCommon: data?.defaultKeyStatistics?.netIncomeToCommon?.raw || null,
      operatingCashflow: data?.financialData?.operatingCashflow?.raw || null,
      profitMargins: data?.defaultKeyStatistics?.profitMargins?.raw || null,
      returnOnEquity: data?.financialData?.returnOnEquity?.raw || null,
      score: {
        valuation: 0,
        health: 0,
        profitability: 0,
        overall: 0,
      },
      createdAt: data?.createdAt,
    };
    this.calculateScore(stock);
    return stock;
  }

  /**
   * Limit a number in a given range.
   *
   * @param {number} value
   *   The value to be checked.
   * @param {number} bottom
   *   The bottom range value.
   * @param {number} top
   *   The top range value.
   *
   * @return {number}
   *   The limited value, between bottom and top range.
   */
  private static limitRange(value: number, bottom: number, top: number) {
    return Math.max(Math.min(value, top), bottom);
  }

  /**
   * Calculate downward score in scale with the given range,
   * the closer the value to the bottom, the better the score is.
   *
   * @param {number|null} value
   *   The value to be checked.
   * @param {number} upper
   *   The upper range value.
   * @param {number} bottom
   *   The bottom range value, minimum bottom value should be 0.
   *
   * @return {number}
   *   The calcualted score ratio, from 0-1.
   */
  private static downScaleScore(value: number | null, upper: number, bottom: number) {
    if (value === (undefined || null)) {
      return 0;
    }

    return 1 - this.upScaleScore(value, bottom, upper);
  }

  /**
   * Calculate upward score in scale with the given range,
   * the closer the value to the upper value, the better the score is.
   *
   * @param {number|null} value
   *   The value to be checked.
   * @param {number} bottom
   *   The bottom range value, minimum bottom value should be 0.
   * @param {number} upper
   *   The upper range value.
   *
   * @return {number}
   *   The calcualted score ratio, from 0-1.
   */
  private static upScaleScore(value: number | null, bottom: number, upper: number) {
    if (value === (undefined || null)) {
      return 0;
    }

    return this.limitRange((value - bottom) / (upper - bottom), 0, 1);
  }

  /**
   * Calculate and update the scores of a stock.
   *
   * @param {Stock} stock
   *   The Stock object.
   */
  private static calculateScore(stock: Stock) {
    // Ratios of different models, all ratios should add up to 1.
    const valuationRatio = 0.45;
    const healthRatio = 0.25;
    const profitabilityRatio = 0.3;

    // Scores of different models, each score should be between 0-100.
    let valuationScore = 0;
    let healthScore = 0;
    let profitabilityScore = 0;

    // Valuation calucation.
    const priceToBookScore =
      this.downScaleScore(stock.priceToBook, 3, 1) * 70 + this.downScaleScore(stock.priceToBook, 1, 0) * 30;
    const priceToEarningsScore =
      this.downScaleScore(stock.priceToEarnings, 15, 10) * 80 + this.downScaleScore(stock.priceToEarnings, 10, 0) * 20;
    const priceToCashScore =
      this.downScaleScore(stock.priceToCash, 5, 2) * 70 + this.downScaleScore(stock.priceToCash, 2, 0) * 30;
    const priceToSalesScore =
      this.downScaleScore(stock.priceToSales, 5, 2) * 70 + this.downScaleScore(stock.priceToSales, 2, 0) * 30;
    const dividendYieldScore =
      this.upScaleScore(stock.dividendYield, 0, 0.04) * 70 + this.upScaleScore(stock.dividendYield, 0.04, 0.08) * 30;

    valuationScore +=
      priceToBookScore * 0.2 +
      priceToEarningsScore * 0.3 +
      priceToCashScore * 0.2 +
      priceToSalesScore * 0.1 +
      dividendYieldScore * 0.2;

    // Health/Risk calculation.
    // A good debt to equity ratio is around 1 to 1.5.
    const debtToEquityScore =
      this.downScaleScore(stock.debtToEquity, 2, 1.5) * 20 + this.downScaleScore(stock.debtToEquity, 1.5, 1) * 80;
    // Normal ratio should be 1, less than 1 is considered a risky ratio.
    const quickRatioScore =
      this.upScaleScore(stock.quickRatio, 0, 1) * 80 + this.upScaleScore(stock.quickRatio, 1, 1.5) * 20;
    const currentRatioScore =
      this.upScaleScore(stock.currentRatio, 0, 1) * 80 + this.upScaleScore(stock.currentRatio, 1, 1.5) * 20;
    // Market cap should be at least 500M and 1B is considered as safe.
    const marketCapScore = this.upScaleScore(stock.marketCap, 500000000, 1000000000) * 100;
    // @todo: calculate DEBT/EQUITY

    healthScore += debtToEquityScore * 0.3 + quickRatioScore * 0.3 + currentRatioScore * 0.25 + marketCapScore * 0.15;

    // Profitability calculation.
    const revenueGrowthScore = this.upScaleScore(stock.revenueGrowth, 0.05, 0.2) * 100;
    const earningsGrowthScore = this.upScaleScore(stock.earningsGrowth, 0.05, 0.1) * 100;
    const roeScore =
      this.upScaleScore(stock.returnOnEquity, 0.1, 0.15) * 40 + this.upScaleScore(stock.returnOnEquity, 0.15, 0.2) * 60;
    const profitMarginScore =
      this.upScaleScore(stock.profitMargins, 0.1, 0.15) * 70 + this.upScaleScore(stock.profitMargins, 0.15, 0.2) * 30;

    profitabilityScore =
      revenueGrowthScore * 0.1 + roeScore * 0.4 + earningsGrowthScore * 0.15 + profitMarginScore * 0.25;

    const totalScore =
      valuationScore * valuationRatio + healthScore * healthRatio + profitabilityScore * profitabilityRatio;

    // @toto: dev code only, remove before release.
    const DEBUG_STOCK_SYMBOL: string = '';
    if (DEBUG_STOCK_SYMBOL && DEBUG_STOCK_SYMBOL.toLowerCase() === stock.symbol?.toLowerCase()) {
      console.table({
        Symbol: stock.symbol,
        'Debt To Equity score': debtToEquityScore,
        'Quick Ratio score': quickRatioScore,
        'Current Ratio score': currentRatioScore,
        'Market Cap score': marketCapScore,
        'Overall score': totalScore,
      });
    }

    // Update stock scores.
    stock.score.valuation = valuationScore;
    stock.score.health = healthScore;
    stock.score.profitability = profitabilityScore;
    stock.score.overall = this.limitRange(totalScore, 0, 100);
  }
}

export { StockScore };
export default StockModel;
