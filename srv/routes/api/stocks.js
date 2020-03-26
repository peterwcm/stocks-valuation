import express from 'express';
import mongodb from 'mongodb';

const router = express.Router();

router.get('/', (req, res) => {
  res.send(['test', 'okay']);
});

module.exports = router;
