const path =require('path')

const multer= require('multer')

   
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'public/multimages')
    },
    filename: function (req, file, cb) {
    let ext=path.extname(file.originalname)
      cb(null, Date.now() + ext)
    }
  })
  
//   const upload = multer ({
//      storage: storage,
//     fileFilter : function(req,file,callback){
//     if(
//         file.mimetype == "image/png" ||
//         file.mimetype == "image/jpg"
//     ){
//          callback(null,true)
//     }
//         else{
//             console.log('only jp & file supported !')
//           callback(null,false)
//         }
//     },
//     limits:{
//         fileSize:1024 *1024 * 2
//     }
// })  
store=multer({storage:storage})
module.exports=store