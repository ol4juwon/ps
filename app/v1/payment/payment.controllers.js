/* eslint-disable camelcase */
'use strict';
const debug = require('debug')('äpp:debug');
const paymentService = require('./payment.service');

exports.chargeInit = async (req, res, next) => {
  const payload = req.body;
  const {error, data} = await paymentService.chargeInit(payload);
  if (error) return createErrorResponse(res, 'error charging card', error, 400);
  return createSuccessResponse(res, 'Charge successful', data.data, 200);
}
exports.chargeCardAuth = async (req,res, next) => {
  const payload = req.body;
  const {error, data} = await paymentService.chargeCardAuth(payload);
  if (error) return createErrorResponse(res, 'error charging card', error, 400);
  return createSuccessResponse(res, 'Charge successful', data.data, 200);
}

exports.verify = async ( req, res, next) => {

console.log("Verify", req.query);
const {trxref, reference, ab} = req.query;
const {error, data} = await paymentService.verify(trxref, reference, ab);
if (error) return createErrorResponse(res, 'error charging card', error, 400);
return createSuccessResponse(res, 'Charge successful', data.data, 200);
}