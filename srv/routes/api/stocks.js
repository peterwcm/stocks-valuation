import express from 'express';
import mongodb from 'mongodb';
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
  const query = watchlist.length
    ? {
        symbol: { $in: watchlist },
      }
    : {};

  if (USE_API) {
    // Load stocks from Mongo.
    const stocks = await loadStocksCollection();
    const invalidSymbols = [];

    for (const symbol of watchlist) {
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
  const stocks = await loadStocksCollection();
  // Fetch the latest stock details for the symbol.
  const stock = await fetchStock(symbol);

  stocks.updateOne({ symbol }, { $set: stock }, { upsert: true });

  res.status(201).send(stock);
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
    .get('https://apidojo-yahoo-finance-v1.p.rapidapi.com/stock/v2/get-statistics', {
      params: {
        region,
        symbol,
      },
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
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

      // Remove the symbol key, property keys containing a dot do not work well with MongoDb.
      stock.quoteData = stock.quoteData[symbol];
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
  };

  return regionMap[symbolRegionPair[1]] || symbolRegionPair[1];
}

/**
 * Load the Mongo stocks collection from remote DB.
 *
 * @return {Collection}
 *   The Mongo stocks collection.
 */
async function loadStocksCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://${process.env.EXPRESS_MONGO_USER}:${process.env.EXPRESS_MONGO_PASSWORD}@${process.env.EXPRESS_MONGO_ENDPOINT}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  );

  return client.db('stocks_valuation').collection('stocks');
}

module.exports = router;
