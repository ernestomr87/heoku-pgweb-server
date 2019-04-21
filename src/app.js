import "@babel/polyfill";
import express from 'express';
import cors from 'cors';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';

import index from './api/routes/index';
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json({
  limit: '2mb',
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: '2mb',
  extended: true
}));

app.use(cors());

app.use('/', index);

// const db = require('./db/models');
// db.sequelize.sync({ force: true }).then(() => {
//   console.log('Drop and Resync with { force: true }');
// });

const env = process.env.NODE_ENV || 'production';

if (env === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, './../build')));
  // Handle React routing, return all requests to React app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, './../build', 'index.html'));
  });
}

if (env === 'development') {
  app.get('/*', function (req, res) {
    res.send('REST API running in development mode');
  });
}

export default app;
