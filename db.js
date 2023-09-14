const mongoose = require('mongoose');
const mongoUrl = ('mongodb://127.0.0.1:27017/MERN-Stack');// cannot use 'localhost' i.e.,('mongodb://localhost:27017/MERN-Stack') will give error => ('connecton failed: MongooseServerSelectionError: connect ECONNREFUSED ::1:27017')

const connecttodb = () => {
    mongoose.connect(mongoUrl).then(() => {
        console.log('connection succesful');
    }).catch((error) => {
        console.log('connecton failed:', error)
    })
}
module.exports = connecttodb;