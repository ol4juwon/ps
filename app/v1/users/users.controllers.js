'use strict';
const debug = require('debug')('äpp:debug');
const authService = require('./users.service');

exports.register = async (req, res, next) => {

	const payload = req.body;
  console.log('register', payload);
	const { error, data } = await authService.register(payload);

	if (error) return createErrorResponse(res, "error creating user", error, 400);

	return createSuccessResponse(res, "Registration successful", data, 201);
};
exports.login = async (req, res, next) => {
	console.log("alv ", req.body);
	const payload = req.body;
	const { error, data } = await authService.login(payload);
	if (error) return createErrorResponse(res, error, 400);
	return createSuccessResponse(res, "Login successful", data, 200);
};

