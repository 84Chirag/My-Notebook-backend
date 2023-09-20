const mongoose = require('mongoose');
const {Schema} = mongoose;

// this is the structure in which data will have to be inserted called as 'BookSchema' (schema means structure)
const BookSchema = new Schema ({
    user:{
        type: 'ObjectId',
        ref: 'user'
    },
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true,
    },
    link:{
        type: String,
        require: true
    },
    tag:{
        type: String,
        default: "General"
    },
    date:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('book', BookSchema);//at this line we creating a new model name "book" and exporting both model and schema