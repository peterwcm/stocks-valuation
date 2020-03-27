import axios from 'axios';

const url = 'http://localhost:3000/api/stocks/';

class StockService {
  static getStocks() {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(url);
        const data = res.data;
        resolve(
          data.map((stock: any) => ({
            ...stock,
            createdAt: new Date(stock.createdAt)
          }))
        );
      } catch (err) {
        reject(err);
      }
    });
  }

  static insertStock(text: string) {
    return axios.post(url, {
      text
    });
  }

  static deleteStock(id: string) {
    return axios.delete(`${url}${id}`);
  }
}

export default StockService;
