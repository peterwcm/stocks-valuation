import express from 'express';
import axios from 'axios';
import stocksData from '../../data/stocks.json';

// @todo: remove this. This was for development only.
const USE_API = true;
const router = express.Router();

/**
 * Retrieve stocks by symbols.
 */
router.post('/', async (req, res) => {
  const watchlist = req.body.watchlist || [];

  if (!req.body.watchlist.length) {
    res.send([]);
    return;
  }

  const query = watchlist.length
    ? {
        symbol: { $in: watchlist },
      }
    : {};

  if (USE_API) {
    // Load stocks from Mongo.
    const stocks = req.app.locals.db.collection('stocks');
    const invalidSymbols = [];

    for (const s of watchlist) {
      const symbol = s.toUpperCase();
      const symbolCount = await stocks
        .find({ symbol })
        .limit(1)
        .count();
      // Fetch stock if it doesn't exist in the DB.
      if (!symbolCount) {
        const stock = await fetchStock(symbol);

        // Cache a stock defensively and fail it silently.
        if (stock) {
          stocks.insertOne(stock);
        } else {
          invalidSymbols.push(symbol);
        }
      }
    }

    if (!invalidSymbols.length) {
      res.send(await stocks.find(query).toArray());
    } else {
      // Send the invalid symbols data back to client.
      res.status(400).send({ invalidSymbols });
    }
  } else {
    res.send(stocksData);
  }
});

/**
 * Fetch a stock by symbol and update DB with its latest details.
 */
router.put('/refresh', async (req, res) => {
  const symbol = req.body.symbol;

  // Load stocks from Mongo.
  const stocks = req.app.locals.db.collection('stocks');
  // Fetch the latest stock details for the symbol.
  const stock = await fetchStock(symbol);

  stocks.updateOne({ symbol }, { $set: stock }, { upsert: true });

  res.status(201).send(stock);
});

/**
 * Delete a stock from the DB.
 */
router.delete('/delete', async (req, res) => {
  const symbol = req.body.symbol;

  // Load stocks from Mongo.
  const stocks = req.app.locals.db.collection('stocks');

  stocks.deleteOne({ symbol }, (err) => {
    if (err) throw err;
  });

  res.status(201).send();
});

/**
 * Fetch stock data from remote API.
 *
 * @param {string} symbol
 *   The stock symbol.
 *
 * @return {AxiosPromise}
 *   The axios promise from the fetch request.
 */
async function fetchStock(symbol) {
  const region = getStockRegion(symbol);
  return axios
    .get('https://yh-finance.p.rapidapi.com/stock/v2/get-summary', {
      params: {
        region,
        symbol,
      },
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
        'x-rapidapi-key': process.env.EXPRESS_RAPIDAPI_KEY,
      },
    })
    .then((response) => {
      // Add missing stock into MongoDB.
      let stock = response.data;

      // Return null if fetch was not successfully.
      if (!stock) {
        return null;
      }

      stock.createdAt = new Date();
      return stock;
    })
    .catch((error) => {
      console.log(`Cannot fetch stock symbol: ${symbol}`);
      console.error(error);
    });
}

/**
 * Retrieve the region code for a stock symbol.
 *
 * @param {string} symbol
 *   The stock symbol, e.g. ANZ.AX, GOOGL, 2317.TW, 0005.HK
 *
 * @return {string}
 *   The 2-character region code.
 */
function getStockRegion(symbol) {
  const symbolRegionPair = symbol.split('.');

  if (symbolRegionPair.length < 2) {
    return 'US';
  }

  // Custom region map for certain exchange.
  const regionMap = {
    AX: 'AU',
    L: 'GB',
  };

  return regionMap[symbolRegionPair[1]] || symbolRegionPair[1];
}

module.exports = router;
