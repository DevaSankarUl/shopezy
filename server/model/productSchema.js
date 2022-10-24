const mongoose = require ('mongoose')
const Schema = mongoose.Schema

const ProductSchema =new Schema({
productName:{
    type:String,
    required:true
},
actualPrice:{
    type:String,
    required:true
},
discountPrice:{
    type:String,
    required:true
},
description:{
    type:String,
    required:true
},
stock:{
    type:Number,
    required:true

},
category:{
    type:String,
    required:true
},
image1: {
    type:String,
    required:true
},
image2: {
    type:String,
    required:true
}
},{timestamps:true})

const Product = mongoose.model('Product',ProductSchema)
module.exports = Product
