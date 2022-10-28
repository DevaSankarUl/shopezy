const express = require('express')
const services = require('../controller/render')
const multer = require('../middlewares/multer')

const router = express.Router()


router.get('/user_login', services.isLoggedOut, services.loginRouter)
router.post('/user_login', services.login)

router.get('/', services.isLoggedIn, services.usrhomedefault)
router.get('/user_home', services.isLoggedIn, services.userHome)
router.get('/user_logout', services.logout)

router.get('/user_registration', services.signUpRouter)
router.post('/user_registration', services.signUp)

router.get('/mobile-verification', services.otpVerification)
router.get('/verifyOtp', services.verifyOtpPage)
router.post('/verifyOtp', services.verifyOtp)
router.post('/user/send-otp', services.sendOtp)

router.get('/user_shop', services.isLoggedIn, services.userShop)
router.get('/view_product', services.isLoggedIn, services.viewProduct)
router.get('/shop/shoes', services.shopshoes)
router.get('/shop/Dresses', services.shopDresses)
router.get('/user-shop/watches', services.Watches)


//cart
router.get('/user_cart', services.isLoggedIn, services.userCart)
// router.post('/cart',services.addcart)
router.post('/user_shop/addToCart', services.addToCart)
router.post('/addToCart/cart-operation', services.isLoggedIn, services.cartOperation)
router.get('/delete-from-cart', services.deleteFromCart)

router.get('/user_profile', services.userProfile)
router.get('/profile/orders/view', services.isLoggedIn, services.viewOrders)
router.get('/profile/orders', services.isLoggedIn, services.orderUser)
router.get('/profile/cancelorder', services.cancelUserOrder)
router.get('/profile/delete/order', services.userdDeleteOrder)

router.get('/user_home/profile-edit', services.editPro)
router.post('/user_home/profile-edit', store.any(), services.profileEdit)



router.get('/wishlist', services.wishList)
router.get('/user_wishlist', services.userWishList)
router.get('/user_home/removewish', services.removewish)


//coupon 
router.post('/cart/apply-coupon', services.isLoggedIn, services.applyCoupon)

router.get('/checkoutPage', services.isLoggedIn, services.checkout)
router.get('/address', services.newAddress)
router.post('/checkout/address', services.isLoggedIn, services.addAddress)
// router.post('/coupen/delete-address',services.deleteAddress)
router.post('/checkout', services.isLoggedIn, services.payment)
router.get('/payment/purchase', services.isLoggedIn, services.purchase)

// router.get('/oderSuccess',services.success)
router.get('/razorpay', services.razorpay)
router.get('/paypal', services.paypal)



module.exports = router