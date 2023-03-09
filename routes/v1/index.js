'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();
const authRouter = require('./auth');
const paymentsRouter = require('./payment');

router.use('/users', authRouter);
router.use('/payments', paymentsRouter);


module.exports = router;
