import axios from 'axios';

const url = 'http://localhost:3000/api/users/';

interface User {
  username: string;
  watchlist: Array<string>;
  createdAt: string;
}

class UserModel {
  static getUser(username: string = '') {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}${username}`)
        .then(res => {
          resolve(res.data ? { watchlist: res.data.watchlist } : {});
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}

export default UserModel;
