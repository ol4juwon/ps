'use strict';
require('dotenv').config({});
const moment = require('moment');
const createError = require('http-errors');
// const multer = require('multer');
// const upload = multer();

const express = require('express');

const http = require('http');

const app = express();
// const debug = require('debug')('app:debug');
const cors = require('cors');
require('./app/Helpers');
require('express-async-errors');
require('./startups')(app, express);
// middlewares
app.use(cors());

app.use(express.json());
app.set('view engine', 'jade');
app.set('views', './views');
app.use((req, res, next) => {
  const requestId = getTimestamp();
  console.log('Time Started',
      moment().toISOString(true), 'headers', req.headers);
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  console.log('Response', requestId);
  console.log(url);
  const cleanup = () => {
    res.removeListener('finish', logFn);
    res.removeListener('close', abortFn);
    res.removeListener('error', errorFn);
  };
  const logFn = (a, b, c) => {
    console.log('Response', requestId);
    // debug("l");
    console.log('Time Ended', moment().toISOString(true));
    cleanup();
  };

  const abortFn = () => {
    cleanup();
    console.log('Time Ended', moment().toISOString(true));
  };
  const errorFn = (err) => {
    cleanup();
    console.log('Time Ended Error', moment().toISOString(true));
  };

  res.on('finish', logFn); // successful pipeline (regardless of its response)
  res.on('close', abortFn); // aborted pipeline
  res.on('error', errorFn); // pipeline internal error
  return next();
});
app.use('/api/v1', require('./routes/v1'));


app.use((req, res, next) => {
  return next(createError(404));
});


// error handler
app.use((err, req, res, next) => {
  res.status(err && err.status || 500);
  res.send({error: err && err.message || 'An error occurred'});
});


module.exports = app;
