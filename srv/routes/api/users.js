import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();

/**
 * Retrieve a user by username.
 */
router.get('/:username', async (req, res) => {
  const users = await loadUsersCollection();
  res.send(await users.findOne({ username: req.params.username }));
});

/**
 * Update a user's watchlist.
 */
router.put('/update', async (req, res) => {
  const users = await loadUsersCollection();
  await users.findOneAndUpdate(
    { username: req.body.username },
    { $set: { watchlist: req.body.watchlist, updatedAt: new Date() } }
  );
  res.status(200).send();
});

/**
 * Load the Mongo users collection from remote DB.
 *
 * @return {Collection}
 *   The Mongo users collection.
 */
async function loadUsersCollection() {
  const client = await mongodb.MongoClient.connect(
    `mongodb+srv://${process.env.EXPRESS_MONGO_USER}:${process.env.EXPRESS_MONGO_PASSWORD}@${process.env.EXPRESS_MONGO_ENDPOINT}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  );

  return client.db('stocks_valuation').collection('users');
}

module.exports = router;
