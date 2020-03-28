import axios from 'axios';

const url = 'http://localhost:3000/api/users';

interface User {
  username: string;
  watchlist: Array<string>;
  createdAt: string;
}

class UserModel {
  static getUser(username: string = '') {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/${username}`)
        .then(res => {
          resolve(res.data ? { watchlist: res.data.watchlist } : {});
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  /**
   * Update a user's watchlist.
   *
   * @param {string} username
   *   The username of the user.
   * @param {Array<string>} watchlist
   *   The new watchlist.
   */
  static updateWatchlist(username: string, watchlist: Array<string>) {
    return axios.put(`${url}/update`, {
      username,
      watchlist
    });
  }
}

export default UserModel;