import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();

// Get User
router.get('/:username', async (req, res) => {
  const users = await loadUsersCollection();
  res.send(await users.findOne({ username: req.params.username }));
});

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
