const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path');
const Grid = require('gridfs-stream')
const multer = require('multer')
const {GridFsStorage} = require('multer-gridfs-storage')

const app = express();
const PORT = 6000
const MongoUrl=''


app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname,'public')))

app.set("view engine","ejs")
app.set('views',path.resolve('./views'))

mongoose.connect(MongoUrl).then(()=>console.log('MongoDb connected'))

app.get('/',(req,res)=>{
    res.render('home')
})

const conn = mongoose.createConnection(MongoUrl)
 let gfs;

 conn.once('open',()=>{
    gfs= Grid(conn.db,mongoose.mongo)
    gfs.collection('uploads')
 })

 const storage = new GridFsStorage({
    url :MongoUrl,
    file:(req,res)=>{
        return{
            filename :`${Date.now()}-${file.originalname}`,
            bucketName :'uploads'
        }
    }
 })

 const upload = multer({storage});

 app.post('/data',upload.single('file'),(req,res)=>{
    if(req.file){
        res.json({file:req.file})
    }else{
        res.status(400).send('file not found')
    }
 })


app.listen(PORT,()=>{
    console.log('Server is running on PORT',PORT)
})