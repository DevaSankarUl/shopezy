const mongoose = require('mongoose')
const { Stream } = require('twilio/lib/twiml/VoiceResponse')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
            type:String,
            require:true
    },
    password:{
            type:String,
            required:true
    },
    mobile:{
            type:String,
            required:true
    },
    
    blockStatus:{
                type:Boolean
     },
        address:[{
                name:{ type: String },
                mobile:{type:String},
                address1:{type:String},
                address2:{type:String},
                city:{type:String},
                state:{type:String},
                zip:{type:String } 
        }],
        profileImage:{
                type:String,
                default:'null'
        }
},{timeStamps:true})
const User=mongoose.model('User',UserSchema)
module.exports=User 