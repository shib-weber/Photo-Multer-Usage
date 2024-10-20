const mongoose = require('mongoose')

const PhotoSchema = mongoose.Schema({
    idno : {type:String,required:true},
    name : {type:String, required:true},
    photo :{type:String,}
})