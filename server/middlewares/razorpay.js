const { json } = require('express');
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: "rzp_test_Xe2nuMPXgXola0",
    key_secret:"Lq15HA5s872FiETdPKtA6XXf",
  });

module.exports = {
    

  generateRazorpay: (totalAmount) => {
    const orderid = 1234567 ;
    return new Promise((res, rej) => {
      console.log("amount is " + totalAmount);

      var options = {
        amount: totalAmount *100, 
        currency: "INR",
        receipt:orderid
      };
 
      console.log("options"+ options)
      instance.orders.create(options, function(err, order) {
        if(err){
          console.log(err)
        }else{
         
           console.log(order);
         res(order)
        }
    })
    })
  },
};