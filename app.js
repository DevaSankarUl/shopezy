 const express=require('express');
 const dotenv = require('dotenv');
 const db = require('./server/database/connection');
 const userRouter=require('./server/routes/userRouter');
 const adminRouter=require('./server/routes/adminRouter')
 const app=express();
 const session = require('express-session')



 app.use(express.static('public'))
 app.use('public/multimages',express.static('public/multimages'))
 dotenv.config({path:"config.env"})
 const PORT =process.env.PORT || 4000

 app.set('view engine','ejs')
 app.use(express.urlencoded({extended:false}))
 app.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
      next();
    });
app.use(session({
    secret :'verygoodpassword',
    resave :false,
    saveUninitialized : true,
    cookie : {maxAge:600000}
}))



    
 db.connectToDb((err)=>{
    if(!err){
        app.listen(PORT,() => {
            console.log(`listening to port ${PORT}`)
     })
     }

})

app.listen(4000,()=>{
    console.log('conneted to server')
})

app.use(userRouter)
app.use(adminRouter)
app.use(function(req,res){
    res.status(404).render('user/404Page.ejs');
  });