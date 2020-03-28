import express from 'express';
import cors from 'cors';
// import socketIO from "socket.io";

export default (app, http) => {
  const users = require('./routes/api/users');
  const stocks = require('./routes/api/stocks');

  app.use(express.json());
  app.use(cors());
  app.use('/api/users', users);
  app.use('/api/stocks', stocks);

  // optional support for socket.io
  //
  // let io = socketIO(http);
  // io.on("connection", client => {
  //   client.on("message", function(data) {
  //     // do something
  //   });
  //   client.emit("message", "Welcome");
  // });
};
