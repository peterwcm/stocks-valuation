import cors from 'cors';
import express from 'express';
import mongodb from 'mongodb';

export default (app) => {
  const users = require('./routes/api/users');
  const stocks = require('./routes/api/stocks');

  // Connect to remote MongoDB and store the DB connection for later use.
  mongodb.MongoClient.connect(
    `mongodb+srv://${process.env.EXPRESS_MONGO_USER}:${process.env.EXPRESS_MONGO_PASSWORD}@${process.env.EXPRESS_MONGO_ENDPOINT}`,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  ).then((client) => {
    app.locals.db = client.db('stocks_valuation');
  });

  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/stocks', stocks);
};
