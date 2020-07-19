import express from 'express';
import cors from 'cors';

export default (app) => {
  const users = require('./routes/api/users');
  const stocks = require('./routes/api/stocks');

  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/stocks', stocks);
};
