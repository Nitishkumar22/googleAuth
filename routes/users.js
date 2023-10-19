const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/googleAuthentication')
mongoose.set('strictQuery',false)

const userSchema = mongoose.Schema({
    name:String,
    email:String
})

module.exports = mongoose.model('user',userSchema);

