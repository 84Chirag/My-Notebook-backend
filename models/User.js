const mongoose = require('mongoose');
const {Schema} = mongoose;

// this is the structure in which data will have to be inserted called as 'UserSchema' (schema means structure)
const UserSchema = new Schema ({
    name:{
        type: String,
        require: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
        unique: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('user', UserSchema);//at this line we creating a new model name "user" and exporting both model and schema