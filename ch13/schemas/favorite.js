const mongoose = require(`mongoose`);

const {Schema} = mongoose;
const favoriteSchema = new Schema({
    placeId : {
        type : String,
        unique : true,
        required : true,
    },
    name : {
        type :String,
        required : true,
    },
    location : {
        type : [Number], index : '2dsphere'
    },
    createdAt : {
        type : Date,
        default : Date.now,
    }
});

module.exrports = mongoose.model('Favorite', favoriteSchema);