'use strict';
const debug = require('debug')('app:debug');
const User = require("./users.model");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const nanoid = require("nanoid").customAlphabet(
// "1234567890abcdefghijklmnopqrstuvwxyz",
// 10
// );
// const otpNano = require("nanoid").customAlphabet("01234567890", 6);


exports.login = async (payload) => {
	const { email, password } = payload;
	if (!email) return { error: "email is required" };
	if (!password) return { error: "password cannot be null" };
	const user = await User.findOne({ email: email });
	if (!user) return { error: "Invalid email provided" };

	const validPass = await bcrypt.compare(password, user.password);
	if (!validPass) return { error: "Invalid password, try again" };


	const token = jwt.sign(
		{
			name: user.name,
			_id: user._id,
			email: user.email,
			avatar: user.avatar,
			username: user.username,
		},
		process.env.TOKEN_SECRET,
		{
			expiresIn: "2h",
		}
	);
	return { data: {
    user_id: user._id,
	balance: user.balance,
    token}};
};
exports.register = async (payload) => {
  try{
    let error;
    let data;
    console.log('ww');
  const { email, password, name} = payload;
	if (!email) return { error: "email is required" };
	if (!password) return { error: "password cannot be null" };
  const emailExist = await User.findOne({ email: email });
  if (emailExist) return { error: "User with email already exists" };
  const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	const user = new User({
    name,
		email: email,
		password: hashedPassword,
	});
  user.save();
  const token = jwt.sign(
		{
			_id: user._id,
			email: user.email,
			name: user.name,
		},
		process.env.TOKEN_SECRET,
		{
			expiresIn: "2h",
		}
	);
data = {
  user_id: user._id,
	balance: user.balance,
  token}
  return {data};
  } catch (e){
    console.log('error', e)
    return { error: e}
  }

}