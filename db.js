const mongoose = require("mongoose")
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main().then(()=>{
    console.log("connect to db")
}).catch(err =>{
    console.log(err)
})


async function main() {
    await mongoose.connect(MONGO_URL)
}

module.exports = mongoose;