const {ObjectID} = require('bson')
const Product = require ('../model/productSchema')

  module.exports = function CartProduct(oldCart){
    this.owner = oldCart.owner,
    this.items = oldCart.items,
    this.bill = oldCart.bill,
    this.add = async function(id){
        let storedItem=this.items.filter((item)=>{
            return id.includes(item.itemId)
        })
       storedItem[0].quantity++;
       const product=await Product.findOne({_id:id})
       storedItem[0].price=storedItem[0].quantity * +product.discountPrice
       this.bill += +product.discountPrice;
       return storedItem
    },
    this.subtract=async function(id){
        let storedItem=this.items.filter((item)=>{
            return id.includes(item.itemId)
        })
        storedItem[0].quantity--;
        const product= await Product.findOne({_id:id})
        storedItem[0].price=storedItem[0].quantity * +product.discountPrice
        this.bill -=+product.discountPrice;
        return storedItem 
    }
  }