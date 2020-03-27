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
              ...stock,
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
