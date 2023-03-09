/* eslint-disable camelcase */
'use strict';
const debug = require('debug')('äpp:debug');
const paystackService = require('../../../services/paystack.service');
const paymentModel = require('./payment.model');
const cards = require('./cards.model')
const userModel = require('../users/users.model');
const nanoid = require("nanoid").customAlphabet("123456789", 10);
exports.chargeInit = async (payload) => {
try{
  const ref = `Alv-init-${nanoid()}`;
  payload.trx_ref = ref;
  payload.meta.trx_ref = ref;
  const addPending = await paymentModel(payload);
  addPending.save().catch(e => console.log(e));
  console.log('Pending', addPending);
  payload.user_id = payload.meta.user_id;
  const {error, data} = await paystackService.cardInit(payload);
  return {error, data}

}catch(e){
  return {error: e}
}
}

exports.chargeCardAuth = async (payload) => {
  try{
    const ref = `Alv-charge-${nanoid()}`;
    payload.trx_ref = ref;
    payload.meta.trx_ref = ref;
    console.log(payload);
    const addPending = await paymentModel(payload);
    addPending.save().catch(e => console.log(e));
    // console.log('Pending', addPending);
    payload.user_id = payload.meta.user_id;
    const {error, data} = await paystackService.chargeToken(payload);
    // console.log(data);
    if(data.status){
      console.log('paid' , data.data)
      if(data.data.status === "success"){
        const addBalance = 
        await userModel.findOneAndUpdate({_id: data.data.metadata.user_id}, 
          {$inc: {balance: parseInt(data.data.amount)/100}}, {new: true}).then((res) => res).catch(err => err);


        console.log("addin",addBalance);
        delete addBalance.avatar;
        data.data = addBalance;
      }
    }
 data.data.avatar = undefined;
    return {error, data}
  
  }catch(e){
    return {error: e}
  }
}

exports.verify = async (trxref, reference, ab) => {
  try{
    const payload = {trxref, reference};
    const {error, data} = await paystackService.verifyTransaction(payload);
    // console.log(error, data);
    if(error){
    return {error}}
    console.log('ssec');
    if(data.status === 'success'){
      // console.log('success data', data.metadata)
      const user = await userModel.findById(data.metadata.user_id);
      // console.log('user', user);
      if(user && ab){
      const addBalance = 
      await userModel.findOneAndUpdate({_id: data.metadata.user_id}, 
        {$inc: {balance: data.amount/100}}, {new: true}).then((res) => res).catch(err => err);
        console.log('adding balance',addBalance);
        if(addBalance){
          const findCard = await cards.findOne({user_id: data.metadata.user_id, cardAuth: data.authorization.authorization_code});
          console.log(findCard);
          if(!findCard){
            const cardAdded = await cards({
              cardAuth: data.authorization.authorization_code,
              user_id: data.metadata.user_id,
              cardSig: data.authorization.signature,
              last4: data.authorization.last4,
              bank: data.authorization.bank,
            })
             cardAdded.save();
            
          }
         
        }
        return {data: {status: 'success', data: addBalance}}
      }
      return {data: {status: data.status} }
    }
  
  }catch(e){
    return {error: e}
  }
}
