const moongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async () => {
    try {
        await moongoose.connect(db, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Moongo connected');
    } catch (err) {
        console.log(err.message);
        process.exit(1);
    }
}


module.exports = connectDB;