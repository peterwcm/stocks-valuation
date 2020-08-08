import express from 'express';

const router = express.Router();

/**
 * Retrieve a user by username.
 */
router.get('/:username', async (req, res) => {
  const users = req.app.locals.db.collection('users');
  res.send(await users.findOne({ username: req.params.username }));
});

/**
 * Update a user's watchlist.
 */
router.put('/update', async (req, res) => {
  const users = req.app.locals.db.collection('users');
  // POST params.
  const { username, watchlistId, watchlist } = req.body;

  await users.findOneAndUpdate(
    { username },
    {
      $set: {
        [`watchlists.${watchlistId}.list`]: watchlist,
        updatedAt: new Date(),
      },
    }
  );
  res.status(200).send();
});

module.exports = router;
