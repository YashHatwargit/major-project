/*const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(()=>{
    console.log("connected to database");
    }).catch(err => console.log(err));
    
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
};

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj, owner:"667f7f1f720dce233bcebf0d"}));
    await Listing.insertMany(initdata.data);
    console.log("initialized");
}*/
//initDB();
const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected to database");
        await initDB();
    } catch (err) {
        console.error("Database connection error", err);
    } finally {
        mongoose.connection.close();
    }
};

const initDB = async () => {
    try {
        await Listing.deleteMany({});
        const modifiedData = initdata.data.map((obj) => ({ ...obj, owner: "667f7f1f720dce233bcebf0d" }));
        await Listing.insertMany(modifiedData);
        console.log("Database initialized");
    } catch (err) {
        console.error("Error initializing database", err);
    }
}

//main();
