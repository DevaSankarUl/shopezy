const mongoose=require('mongoose')
const Schema=mongoose.Schema

const wishlistSchema=new Schema({
    userid:{
        type:String
    },
    productName:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    quantity:{
        type:String,
        required:true
    },
    image1:{
        type:String,
        required:true
    },
    productid:{
        type:String,
        required:true
    }
},{timestamps:true})
const Wishlist=mongoose.model('Wishlist',wishlistSchema)
module.exports=Wishlist;