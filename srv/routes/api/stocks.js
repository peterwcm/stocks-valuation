import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();

// Get Stocks
router.get('/', async (req, res) => {
  const stocks = await loadStocksCollection();
  res.send(await stocks.find({}).toArray());
});

// Add Stock
router.post('/', async (req, res) => {
  const stocks = await loadStocksCollection();
  await stocks.insertOne({
    text: req.body.text,
    createdAt: new Date()
  });
  res.status(201).send();
});

// Delete Stock
// router.delete('/:id', async (req, res) => {
//   const stocks = await loadStocksCollection();
//   await stocks.deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
//   res.status(200).send();
// });

async function loadStocksCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://${process.env.EXPRESS_MONGO_USER}:${process.env.EXPRESS_MONGO_PASSWORD}@${process.env.EXPRESS_MONGO_ENDPOINT}`,
    {
      useNewUrlParser: true
    }
  );

  return client.db('stocks_valuation').collection('stocks');
}

module.exports = router;
