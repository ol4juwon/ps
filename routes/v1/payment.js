'use strict';
// eslint-disable-next-line new-cap
const router = require('express').Router();

const paymentController = require('../../app/v1/payment/payment.controllers');
const paymentValidator = require('../../app/v1/payment/payment.validator');
console.log('sss')
router.post('/charge', paymentValidator.charge, paymentController.chargeCardAuth);
router.post('/init', paymentValidator.init, paymentController.chargeInit);
router.get('/verify', paymentController.verify);
module.exports = router;
