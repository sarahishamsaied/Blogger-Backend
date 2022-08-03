const express = require('express');
require("dotenv").config();
// const multer = require("multer")
// const {nanoid} = require("nanoid")
const initConnection = require("./Database/config");
const cors = require("cors");
const {userRoutes,commentsRoutes,blogRoutes,voteRoutes} = require("./Routes/routes");
const app = express()
app.use(cors());
app.use(express.json());
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'UploadImages')
//     },
//     filename: function (req, file, cb) {
//         cb(null,nanoid()+"_"+file.originalname)
//     }
//   })
//   function fileFilter(req,file,cb){
//     if(file.mimetype === 'image/png' ||file.mimetype === 'image/jpeg' ||file.mimetype === 'image/png')
//     cb(null,true)
//     else
//     cb("Invalid file extension",false);
//   }
//   const upload = multer({
//     dest:'uploadImages/',
//     fileFilter,
//     storage
//   })
const port = process.env.PORT
app.use(userRoutes);
// app.use(upload.array('image',15))
app.use(commentsRoutes);
app.use(blogRoutes);
app.use(voteRoutes);
app.get('/', (req, res) => res.send('Hello World!'))
initConnection();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))