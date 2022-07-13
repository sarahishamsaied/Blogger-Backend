const mongoose = require("mongoose");
const initConnection = ()=>{
    console.log("mongop")
   return mongoose.connect(process.env.CONNECTION_STRING).then((result) => {
    }).catch((err) => {
        console.log(err);
    });
}
module.exports = initConnection;