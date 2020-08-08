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
router.put('/:username/watchlist/:watchlistId/update', async (req, res) => {
  const users = req.app.locals.db.collection('users');
  const { username, watchlistId } = req.params;

  await users.findOneAndUpdate(
    { username },
    {
      $set: {
        [`watchlists.${watchlistId}.list`]: req.body.watchlist,
        updatedAt: new Date(),
      },
    }
  );
  res.status(200).send();
});

/**
 * Delete a user's watchlist.
 */
router.delete('/:username/watchlist/:watchlistId/delete', async (req, res) => {});

module.exports = router;
