
const mongoose = require('mongoose')

const Schema = mongoose.Schema

const OrderSchema = new Schema({

    user : {
        type : String,
    },

    items : [{
        
        itemId : {
            type : String,
            required : true
        },

        productName :{
            type : String,
            required : true
        },
        price : {
            type :Number,
            required : true
        },
        
        quantity : {
            type : Number,
            required : true,
            min : 1,
            default : 1
        },
        category : {
            type : String,
            required : true
        },

        image1 : {
            type : String,
           required : true
        },
        orderStatus : {
            type : String
        }
        }],
    address : {
        type : Object
    },

    cartBill : {
        type : Number,
        required : true,
        default : 0
    },

    orderDate : {
         type : String  
    },

    paymentMethod : {
        type : String
    },
    couponCode : {
        type : String,
        trim : true
    },
    couponValue : {
        type : Number,
        trim : true
    },
    orderBill : {
        type : Number,
        trim : true
    },
    orderStatus:{
        type:String,
        default:"New"
    }

   
    
},{ timestamps : true})

const Order = mongoose.model ('Order', OrderSchema)

module.exports = Order


