const mongoose = require(`mongoose`);

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.eventNames;
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

module.exports = () => {
    const connect = () => {
        if (NODE_ENV !== 'production') {
            mongoose.set(`debug`, true);
        }
        mongoose.connect(MONGO_URL, {
            dbName : 'nodeplace'
        }, (err) => {
            if (err) {
                console.log(`mongo DB 연결 에러`, error);
            } else {
                console.log(`몽고 디비 연결 성공`);
            }
        });;
    };
    connect();

    mongoose.connection.on(`error`, (error) => {
        console.error(`MongoDB connection error!`, error);
    })
    mongoose.connection.on(`disconnected`, () => {
        console.error(`Connection is disconnected!. Trying to connection`);
        connect();
    })

    require(`./favorite`);
    require(`./history`);
};