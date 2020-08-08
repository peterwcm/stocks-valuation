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
 * Add a user's watchlist.
 */
router.post('/:username/watchlist/add', async (req, res) => {
  const users = req.app.locals.db.collection('users');
  const { username } = req.params;

  await users.findOneAndUpdate(
    { username },
    {
      $push: {
        watchlists: {
          name: req.body.name,
          list: [],
        },
      },
      $set: {
        updatedAt: new Date(),
      },
    }
  );
  res.status(200).send();
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
 * Rename a user's watchlist.
 */
router.put('/:username/watchlist/:watchlistId/rename', async (req, res) => {
  const users = req.app.locals.db.collection('users');
  const { username, watchlistId } = req.params;

  await users.findOneAndUpdate(
    { username },
    {
      $set: {
        [`watchlists.${watchlistId}.name`]: req.body.name,
        updatedAt: new Date(),
      },
    }
  );
  res.status(200).send();
});

/**
 * Delete a user's watchlist.
 */
router.delete('/:username/watchlist/:watchlistId/delete', async (req, res) => {
  const users = req.app.locals.db.collection('users');
  let { username, watchlistId } = req.params;
  watchlistId = Number(watchlistId);

  await users.findOneAndUpdate({ username }, [
    {
      $set: {
        watchlists: {
          $concatArrays: [
            { $slice: ['$watchlists', watchlistId] },
            { $slice: ['$watchlists', { $add: [1, watchlistId] }, { $size: '$watchlists' }] },
          ],
        },
        updatedAt: new Date(),
      },
    },
  ]);
  res.status(200).send();
});

module.exports = router;
