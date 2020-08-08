import axios, { AxiosPromise } from 'axios';

// The local server URL for users API.
const url = 'http://localhost:3000/api/users';

/**
 * The User interface.
 */
interface User {
  username: string;
  watchlists: Array<Watchlist>;
  createdAt: string;
  updatedAt: string;
}

/**
 * The Watchlist interface.
 */
interface Watchlist {
  name: string;
  list: Array<string>;
}

/**
 * The User model service.
 */
class UserModel {
  /**
   * Retrieve a user by username.
   *
   * @param {string} username
   *   The username of the user.
   *
   * @return {Promise<User>}
   *   The promise with User object.
   */
  static getUser(username: string = ''): Promise<User> {
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}/${username}`)
        .then((res) => {
          resolve(res.data || {});
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * Update a user's watchlist.
   *
   * @param {string} username
   *   The username of the user.
   * @param {number} watchlistId
   *   The watchlist ID.
   * @param {Array<string>} watchlist
   *   The new watchlist.
   *
   * @return {AxiosPromise}
   *   The axios promise from the update request.
   */
  static updateWatchlist(username: string, watchlistId: number, watchlist: Array<string>): AxiosPromise {
    return axios.put(`${url}/${username}/watchlist/${watchlistId}/update`, {
      watchlist,
    });
  }

  /**
   * Delete a user's watchlist.
   *
   * @param {string} username
   *   The username of the user.
   * @param {number} watchlistId
   *   The watchlist ID.
   */
  deleteWatchlist(username: string, watchlistId: number) {}
}

export default UserModel;
