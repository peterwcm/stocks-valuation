import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import socketIO from "socket.io";

export default (app, http) => {
  const stocks = require('./routes/api/stocks');

  app.use(express.json());
  app.use(cors());
  app.use('/api/stocks', stocks);
  //
  // app.get('/foo', (req, res) => {
  //   res.json({msg: 'foo'});
  // });
  //
  // app.post('/bar', (req, res) => {
  //   res.json(req.body);
  // });
  //
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
