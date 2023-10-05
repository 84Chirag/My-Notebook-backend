const mongoose = require('mongoose');
const mongoUrl = ('mongodb+srv://chiragvgour:YC8nB5y5UC9JtX8t@mern-stack.jixph0o.mongodb.net/MERN-STACK');// cannot use 'localhost' i.e.,('mongodb://localhost:27017/MERN-Stack') will give error => ('connecton failed: MongooseServerSelectionError: connect ECONNREFUSED ::1:27017')

const connecttodb = () => {
    mongoose.connect(mongoUrl).then(() => {
        console.log('connection succesful');
    }).catch((error) => {
        console.log('connecton failed:', error)
    })
}
module.exports = connecttodb;