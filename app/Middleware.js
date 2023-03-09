'use strict';
const debug = require('debug')('app:debug');

const {clients} = require('./Clients');

exports.validateUser = async (req, res, next) => {
  let clientId = req.headers['x-access-token'] ||
  req.headers['authorization'] ||
   req.headers['client-id'] || req.headers['client_id'];
  debug('This is the client id', clientId);
  if (!clientId) {
    return createErrorResponse(res,
        'You are not authorised to use this service', 403);
  }
  if (clientId.startsWith('Bearer ')) {
    // Remove Bearer from string
    clientId = clientId.slice(7, clientId.length);
  }
  res.client = clients[clientId];
  if (!res.client) {
    return createErrorResponse(res,
        'You are not authorised to use this service', 403);
  }

  require('axios').defaults.headers.common['client-id'] = clientId;
  return next();
};

