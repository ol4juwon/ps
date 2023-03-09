
var axios = require("axios");
const secKey = process.env.PAYSTACK_SECRET_KEY;
const debug = require("debug")("app:debug");

class PaystacksService {
    constructor(){
        this._axios = axios.create({
            baseURL: "https://api.paystack.co",
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${secKey}`,
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'

            }
        });
        this.email = "olajuwonlawal2012@gmail.com";
    }
    async cardInit(payload) {
        try {
            console.log("Email", payload.email);
            console.log("Amount", payload.amount);
            console.log("RedirectUrl", payload.redirectUrl);
            const body  =  {
                amount: payload.amount * 100,
                reference: payload.trx_ref,
                channels: ['card'],
                email: payload.email || this.email,
                metadata: payload.meta,
                callback_url: `https://localhost:4000/api/v1/payment/verify`
            };
            console.log("request body1 ",body);
            const response = await this._axios
                .post(`/transaction/initialize`,body);
            console.log("pss", response.data);
            return {data:response.data};
        } catch (e) {
            console.log(e);
            return e.response.data;
            // throw new CustomPaystackError(e);
        }
    }

    async chargeMomo(payload){

        try{
            console.log("payload", payload);
            const response = await this._axios.post(`/transaction/charge_authorization`, );

        }catch(e){

        }
    }
    async verifyTransaction(payload) {
   
        try {
            // console.log("payload", payload.reference);
            const response = await this._axios
                .get(`/transaction/verify/${payload.trxref}`);

            console.log("VErifying ============>>>>>> ", response.data.data);
        
            return {
                status: response.data.status,
                data: response.data.data};
        } catch (error) {
            return {
                status: false,
                error: error.response && error.response.data && error.response.data.message || error.message || 'Gateway Timeout',
            };
            // throw new CustomPaystackError(e);
        }
    }

    async chargeToken(payload){
        try {
            // console.log(payload.trx_ref, payload.cardAuth, payload.amount, payload.email);
            const response = await this._axios.post(`/transaction/charge_authorization`, {
                reference: payload.trx_ref,
                authorization_code: payload.cardAuth,
                amount: payload.amount * 100,
                currency: "NGN",
                metadata: payload.meta,
                email: payload.email.trim().toString()
            });
            // console.log("Response", JSON.stringify(response.data));
            return {data: response.data}
        } catch (e) {
            debug("paystack charge error---", e.message, e.response);
            logger(e.message, e.stack, {
                error: handleAxiosError(e),
                transactionId,
                chargeAuth,
                amount,
                email
            }, true);
            return {
                statue: false,
                message: e.message
            };
            // throw new CustomPaystackError(e);
        }
    }
}

module.exports = new PaystacksService();