const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path');
const exp = require('constants');

const app = express();
const PORT = 6000


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))

mongoose.connect('').then(()=>console.log('MongoDb connected'))

app.get('/',(req,res)=>{
    res.render('home')
})

app.listen(PORT,()=>{
    console.log('Server is running on PORT',PORT)
})