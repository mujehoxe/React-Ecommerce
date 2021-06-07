
const MongoClient = require('mongodb').MongoClient;

function connect(){
    return MongoClient.connect(
        "mongodb://localhost:27017",{ useUnifiedTopology: true })
        .then(client => client.db('ecommerce'))
}

module.exports = async function() {
    return await connect()
}