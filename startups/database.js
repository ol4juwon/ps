"use strict"

const mongoose =  require("mongoose");

mongoose.set('debug', true);
const monogodbUrl = `${process.env.MONGODB_URL}?retryWrites=true`;
console.log("MONGO_DB", monogodbUrl);
mongoose.connect(monogodbUrl,{useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology:  true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on("connected", () => {
    console.log("Mongo connected");

})

db.on('error', (error) => {
    console.error("An error occured", JSON.stringify(error))
    process.exit(1)
})