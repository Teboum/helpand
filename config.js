const env = require("dotenv");
env.config()

module.exports={
    JWT_SECRET:process.env.JWT_SECRET,
    MONGODB_URL:"mongodb://admin:Nic5EbGYQdKW1elb@cluster0-shard-00-00.1zmow.mongodb.net:27017,cluster0-shard-00-01.1zmow.mongodb.net:27017,cluster0-shard-00-02.1zmow.mongodb.net:27017/helpandconnect?ssl=true&replicaSet=atlas-99qvgc-shard-0&authSource=admin&retryWrites=true&w=majority"
    
}