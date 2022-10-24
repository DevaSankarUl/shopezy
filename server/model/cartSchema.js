const mongoose=require('mongoose')
const{ObjectID}=require('bson')

const Schema=mongoose.Schema

const cartSchema=new mongoose.Schema({
    owner:{
        type:String,
        required:true
    },
    items:[{
        itemId:{
            type:ObjectID,
            requried:true
        },
        productName:{
            type:String
        },
        quantity:{
            type:Number,
            required:true,
            min:1,
            default:1
        },
        price:{
            type:Number
        },
        category:{
            type:String,
            required:true
        },
        image1:{
            type:String,
            required:true
        }
    }],
    bill:{
        type:Number,
        required:true,
        default:0
    }
},{timestamps:true})
const Cart = mongoose.model('Cart',cartSchema);
module.exports = Cart