import express from 'express';
import mongodb from 'mongodb';
import stocksData from '../../data/stocks.json';

// @todo: remove this. This was for development only.
const USE_API = true;
const router = express.Router();

/**
 * Retrieve stocks by symbols.
 */
router.post('/', async (req, res) => {
  const watchlist = req.body.watchlist || [];

  if (USE_API) {
    // Load stocks from Mongo.
    const stocks = await loadStocksCollection();
    res.send(
      await stocks
        .find({
          symbol: { $in: watchlist }
        })
        .toArray()
    );
  } else {
    res.send(stocksData);
  }
});

/**
 * Add a new stock.
 */
// router.post('/', async (req, res) => {
//   const stocks = await loadStocksCollection();
//   await stocks.insertOne({
//     ...req.body,
//     createdAt: new Date()
//   });
//   res.status(201).send();
// });

/**
 * Delete a stock.
 */
// router.delete('/:id', async (req, res) => {
//   const stocks = await loadStocksCollection();
//   await stocks.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
//   res.status(200).send();
// });

/**
 * Load the Mongo stocks collection from remote DB.
 */
async function loadStocksCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://${process.env.EXPRESS_MONGO_USER}:${process.env.EXPRESS_MONGO_PASSWORD}@${process.env.EXPRESS_MONGO_ENDPOINT}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  );

  return client.db('stocks_valuation').collection('stocks');
}

module.exports = router;
