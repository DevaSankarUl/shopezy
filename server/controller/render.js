const User = require('../model/userSchema')
const Admin = require('../model/adminSchema');
const Product = require('../model/productSchema')
const { restart } = require('nodemon');
const { isObjectIdOrHexString } = require('mongoose');
const { ObjectId } = require('bson')
const otp = require('../middlewares/otp');
const Cart = require('../model/cartSchema');
const WishList = require('../model/wishlistSchema');
const CartProduct = require('../model/cart');
const Wishlist = require('../model/wishlistSchema');
const Order = require('../model/orderSchema');
const Category = require('../model/categorySchema');
const { ConnectionPolicyPage } = require('twilio/lib/rest/voice/v1/connectionPolicy');
const Razorpay = require('razorpay')
let Paypal = require('paypal-rest-sdk')
const Coupon = require('../model/couponSchema')
const orderHelpers = require('../helpers/orderHelpers')
const axios = require('axios')
const excelJs = require('exceljs')

let session;
let validation = {
    category: false,
    existingCoupon: false,
    validCoupon: false,
    usedCoupon: false,
    dateExpiry: false,
    amountMin: false,
}

let ddate = new Date();
let month = ddate.getMonth() + 1;
const tis = ddate.toISOString().split('T')[0];

exports.isLoggedIn = (req, res, next) => {
    session = req.session
    if (session.userId) {
        next()
    } else {
        res.redirect('user_login')
    }
}
exports.isLoggedOut = (req, res, next) => {
    session = req.session
    if (!session.userId) {
        next()
    } else {
        res.redirect('user_home')
    }
}
exports.adminLoggedIn = (req, res, next) => {
    session = req.session
    if (session.adminId) {
        next()
    } else
        res.redirect('admin_signin')
}

exports.adminLoggedOut = (req, res, next) => {
    session = req.session
    if (!session.adminId) {
        next()
    } else {
        res.redirect('admin_panel')
    }
}


exports.loginRouter = (req, res) => {
    let response = ({
        blockStatusErr: req.query.blockStatus,
        blockStatusErrMsg: "Your  Account were Blocked",
        passErr: req.query.pass,
        passErrMsg: "password Incorrect",
        registerErr: req.query.register,
        registerErrMsg: "User not Found"
    })
    session = req.session
    if (session.userId) {
        res.render('user/home')
    }
    else {
        res.render('user/login', { response })
    }
}

exports.signUpRouter = (req, res) => {
    let response = ({
        passErr: req.query.pass,
        passErrMsg: "Invalid Password",
        accountErr: req.query.account,
        accountErrMsg: "user already Registered"
    })
    res.render('user/signup', { response })
}

exports.usrhomedefault = (req, res) => {
    res.redirect('/user_home')
}

exports.userHome = (req, res) => {
    res.render('user/home')
}
exports.login = (req, res) => {
    const loginData = req.body
    User.findOne({ email: loginData.email, password: loginData.password, blockStatus: false })
        .then((result) => {
            if (result) {
                session = req.session
                session.userId = loginData.email
                // console.log(session)
                res.render('user/home')
            }
            else {
                User.findOne({ email: loginData.email })
                    .then((result) => {
                        if (result) {
                            if (result.blockStatus) {
                                res.redirect('/user_login?blockStatus=true')
                            } else {
                                res.redirect('/user_login?pass=false')
                            }

                        }
                        else {
                            res.redirect('/user_login?register=false')
                        }
                    })
            }

        })
        .catch((err) => {
            console.log(err)
            res.redirect('user_login')
        })
}
exports.signUp = (req, res) => {
    if (req.body.confirmPassword === req.body.password) {
        let userEmail = req.body.email
        User.findOne({ email: userEmail })
            .then((result) => {
                if (result) {
                    res.redirect('user_registration?account=true')
                }
                else {
                    const data = new User(req.body)
                    data.blockStatus = false

                    data.save()
                        .then(() => {
                            res.redirect('user_login')
                        })
                        .catch((err) => {
                            console.log(err)
                            // res.redirect('user_registration')
                        })
                }
            })
    } else {
        res.redirect('/user_registration?pass=false')
    }
}
exports.adminLoginRouter = (req, res) => {
    let response = ({
        passErr: req.query.pass,
        passErrMsg: "Invalid Password",
        registerErr: req.query.register,
        registerErrMsg: "Admin not Found"
    })
    res.render('admin/login', { response })
}
exports.adminlogin = (req, res) => {
    const loginData = req.body
    Admin.findOne({ name: loginData.name, password: loginData.password })
        .then((result) => {
            if (result) {
                session = req.session
                session.adminId = loginData.name
                // console.log(session)
                res.redirect('/admin_panel')
            }
            else {
                Admin.findOne({ name: loginData.name })
                    .then((result) => {
                        if (result) {
                            res.redirect('/admin_signin?pass=false')
                        } else {
                            res.redirect('/admin_signin?register=false')
                        }
                    })
            }
        })
        .catch((err) => console.log(err))
}

exports.adminPanel = (req, res) => {
    res.render('admin/dashboard')
}



exports.test = (req, res) => {

    const months = [
        january = [],
        february = [],
        march = [],
        april = [],
        may = [],
        june = [],
        july = [],
        august = [],
        september = [],
        october = [],
        november = [],
        december = []
    ]

    const quarters = [
        Q1 = [],
        Q2 = [],
        Q3 = [],
        Q4 = []
    ]

    const monthNum = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

    Order.find({ "items.orderStatus": "processed" })
        .then((orders) => {
            monthNum.forEach((month, monthIndex) => {
                orders.forEach((order, index) => {
                    if (order.createdAt.getMonth() + 1 == monthIndex + 1) {
                        months[monthIndex].push(order);
                    }
                })
            })//

            orders.forEach((order) => {
                if (order.createdAt.getMonth() + 1 <= 3) {
                    quarters[0].push(order)
                } else if (order.createdAt.getMonth() + 1 > 3 && order.createdAt.getMonth() + 1 <= 6) {
                    quarters[1].push(order)
                } else if (order.createdAt.getMonth() + 1 > 6 && order.createdAt.getMonth() + 1 <= 9) {
                    quarters[2].push(order)
                } else if (order.createdAt.getMonth() + 1 > 9 && order.createdAt.getMonth() + 1 <= 12) {
                    quarters[3].push(order)
                }
            })

            const monthlySalesTurnover = [];
            const quarterlySalesTurnover = [];
            months.forEach((month) => {
                let eachMonthTurnover = month.reduce((acc, curr) => {
                    acc += +curr.orderBill;
                    return acc;
                }, 0)
                monthlySalesTurnover.push(eachMonthTurnover);
            })

            quarters.forEach((quarter) => {
                let eachQuarterTurnover = quarter.reduce((acc, curr) => {
                    acc += curr.orderBill;
                    return acc;
                }, 0)
                quarterlySalesTurnover.push(eachQuarterTurnover)
            })

            let annualSales = orders.reduce((acc, curr) => {
                acc += curr.orderBill
                return acc;
            }, 0)

            res.json({ salesOfTheYear: monthlySalesTurnover, quarterlySales: quarterlySalesTurnover, annualSales: annualSales })
        })
}



exports.exportExcel = (req, res) => {
    Order.find()
        .then((SalesReport) => {


            console.log(SalesReport)
            try {
                const workbook = new excelJs.Workbook();

                const worksheet = workbook.addWorksheet("Sales Report");

                worksheet.columns = [
                    { header: "S no.", key: "s_no" },
                    { header: "OrderID", key: "_id" },
                    { header: "Date", key: "orderDate" },
                    { header: "Products", key: "productName" },
                    { header: "Method", key: "paymentMethod" },
                    //     { header: "status", key: "status" },
                    { header: "Amount", key: "orderBill" },
                ];
                let counter = 1;
                SalesReport.forEach((report) => {
                    report.s_no = counter;
                    report.productName = "";
                    // report.name = report.userid;
                    report.items.forEach((eachproduct) => {
                        report.productName += eachproduct.productName + ", ";
                    });
                    worksheet.addRow(report);
                    counter++;
                });

                worksheet.getRow(1).eachCell((cell) => {
                    cell.font = { bold: true };
                });


                res.header(
                    "Content-Type",
                    "application/vnd.oppenxmlformats-officedocument.spreadsheatml.sheet"
                );
                res.header("Content-Disposition", "attachment; filename=report.xlsx");

                workbook.xlsx.write(res);
            } catch (err) {
                console.log(err.message);
            }
        });

}


exports.adminLogout = (req, res) => {
    req.session.destroy();
    res.redirect('/admin_signin')
}
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/user_login')
}
// exports.adminUsers = (req,res)=>{
//     res.render('admin/users')
// }

//users fun
exports.adminUsers = (req, res) => {
    User.find((err, users) => {
        if (!err) {
            res.render('admin/userManagement', { users })
        }
    })
}
exports.userBlock = (req, res) => {
    let blockId = req.query.id
    User.updateOne({ _id: ObjectId(blockId) }, { $set: { blockStatus: true } })
        .then(() => {
            // console.log('updated')
            req.session.userId = ""
            res.redirect('/user-management')
        })
        .catch((err) => {
            console.log(err)
        })
}
exports.userUnblock = (req, res) => {
    let blockId = req.query.id
    User.updateOne({ _id: ObjectId(blockId) }, { $set: { blockStatus: false } })
        .then(() => {
            res.redirect('/user-management')
        })
        .catch((err) => {
            console.log(err)
        })
}
exports.viewProduct = (req, res) => {
    let productId = req.query.id
    Product.find({ _id: ObjectId(productId) })
        .then((result) => {
            if (result) {
                // console.log(result)
                res.render('user/viewProduct', { result })
            } else {
                console.log(err);
            }
        })
        .catch((err) => {
            console.log(err)
        })
}
exports.shopshoes = (req, res) => {
    Product.find({ category: "shoes" })
        .then((result) => {
            res.render('user/shop', { result })
        })
}
exports.shopDresses = (req, res) => {
    Product.find({ category: "Dresses" })
        .then((result) => {
            res.render('user/shop', { result })
        })
}
exports.Watches = (req, res) => {
    Product.find({ category: "Watches" })
        .then((result) => {
            res.render('user/shop', { result })
        })
}


//  otp
exports.otpVerification = (req, res) => {
    res.render('user/mobile-verification')
}
exports.verifyOtpPage = (req, res) => {
    res.render('user/otp-verify')
}
exports.verifyOtp = (req, res) => {
    let otpObject = req.body
    otp.veriOtp(otpObject.otp, req.session.mobileNumber)
        .then((users) => {
            if (users) {
                User.findOne({ mobile: req.session.mobileNumber })
                    .then((user) => {
                        req.session.userId = user.email
                        req.session.otplogin = true
                        res.redirect('/user_home')
                    })

            } else {
                res.redirect('/verifyOtp')
            }
        })
        .catch((err) => {
            console.log(err)
        })
}

exports.sendOtp = (req, res) => {
    // console.log(req.body.mobile)
    User.findOne({ mobile: req.body.mobile })
        .then((user) => {
            if (user) {
                req.session.mobileNumber = req.body.mobile
                otp.sendOtp(req.body.mobile)
                res.redirect('/verifyOtp')
            }
            else {
                res.send("Not Valid")
            }
        })
}
exports.productTable = (req, res) => {
    Product.find()
        .then((result) => {
            res.render('admin/product-table', { result })
        })
}
exports.addproduct = (req, res) => {
    Category.find()
        .then((cat) => {
            res.render('admin/add-product', { result: '', cat })

        })
}

exports.addProducts = (req, res, next) => {
    const files = req.files;

    if (!files) {
        const error = new Error('Please choose file')
        error.httpStatusCode = 400
        return next(error)
    }
    let productDetail = new Product({
        productName: req.body.productName,
        actualPrice: req.body.actualPrice,
        discountPrice: req.body.discountPrice,
        description: req.body.description,
        stock: req.body.stock,
        category: req.body.category,
        image1: req.files[0] && req.files[0].filename ? req.files[0].filename : "",
        image2: req.files[1] && req.files[1].filename ? req.files[1].filename : ""
    })

    productDetail.save()
        .then(() => {
            res.redirect('/product')
        })
        .catch(error => {
            console.log(error)
        })
}

exports.editProduct = (req, res) => {
    let editId = req.query.id
    Product.findOne({ _id: ObjectId(editId) })
        .then((result) => {
            if (result) {
                res.render('admin/add-product', { result })
            }
        })
}
exports.UpdateProduct = (req, res) => {
    let updateId = req.query.id
    Product.updateOne({ _id: ObjectId(updateId) }, {
        $set:
        {
            productName: req.body.productName,
            actualPrice: req.body.actualPrice,
            discountPrice: req.body.discountPrice,
            description: req.body.description,
            stock: req.body.stock,
            category: req.body.category,
            subCategory: req.body.subCategory,
            // image1: req.files[0] && req.files.filename ? req.files[0].filename:"",
            // image2: req.files[0] && req.files.filename ? req.files[1].filename:""
            image1: req.files[0] && req.files[0].filename ? req.files[0].filename : "",
            image2: req.files[1] && req.files[1].filename ? req.files[1].filename : ""


        }
    })
        .then(() => {
            res.redirect('/product_table')
        })
        .catch((err) => {
            console.log(err)
        })
}
exports.deleteProduct = (req, res) => {
    let deleteId = req.query.id
    Product.deleteOne({ _id: ObjectId(deleteId) })
        .then(() => {
            res.redirect('/product_table')
        })
        .catch((err) => {
            console.log(err);
        })
}
exports.userShop = (req, res) => {
    Product.find()
        .then((result) => {
            if (result) {
                res.render('user/shop', { result })
            }
        })
}
exports.userCart = (req, res) => {
    // let user = req.session.userId
    Cart.findOne({ owner: req.session.userId })
        .then((result) => {
            // console.log(result);
            if (result) {

                res.render('user/cart', { result })
            }
            else
                res.render('user/cart', {
                    result: {
                        items: []
                    }
                });
        })
        .catch((err) => {
            console.log(err)
        })
}
// exports.addcart=(req,res)=>{
//     let id=req.query.id
//     Product.findOne({_id: id})
//     .then((result)=>{
//         if(result){
//             let cartItem=new Cart({
//                 author:req.session.userId,
//                 productName:result.productName,
//                 price:result.actualPrice,
//         description:result.description,
//         stock:result.stock,
//         category:result.category,
//         subCategory:result.subCategory,
//         image1:result.image1,
//         image2:result.image2,
//         cart:true
//       })
//       cartItem.save()
//       .then(()=>{
//         res.redirect('/user_shop')
//       })
//       .catch((err)=>{console.log(err)})
//     }
//   })
// }
//addToCart 
exports.addToCart = (req, res) => {
    let session = req.session
    let user = session.userId
    Cart.findOne({ owner: user })
        .then((result) => {
            if (result) {
                Cart.findOne({ "items.itemId": req.query.id })
                    .then((oldCart) => {
                        if (oldCart) {
                            let cart = new CartProduct(oldCart)
                            let cartItem = cart.add(req.query.id)
                            cartItem.then((cartItem) => {
                                let newCart = oldCart;
                                let indexOfOldItem = 0;
                                for (let i = 0; i < newCart.items.length; i++) {
                                    if (req.query.id.includes(newCart.items[i].itemId)) {
                                        indexOfOldItem = i;
                                        break;
                                    }
                                }
                                newCart.items.splice(indexOfOldItem, 1, cartItem[0]);
                                Cart.replaceOne({ owner: oldCart.owner }, {
                                    owner: newCart.owner,
                                    items: newCart.items,
                                    bill: cart.bill
                                })
                                    .then(() => res.redirect('/user_shop'))
                            })
                        } else {
                            Product.findOne({ _id: req.query.id })
                                .then((product) => {
                                    let newCartItem = {
                                        itemId: product._id,
                                        productName: product.productName,
                                        quantity: 1,
                                        price: product.discountPrice,
                                        category: product.category,
                                        image1: product.image1
                                    }
                                    let newCart = result;
                                    newCart.items.push(newCartItem)
                                    totalBill = +newCart.bill + +newCartItem.price
                                    newCart.bill = totalBill;
                                    Cart.replaceOne({ owner: user }, {
                                        owner: newCart.owner,
                                        items: newCart.items,
                                        bill: newCart.bill
                                    })
                                        .then(() => res.redirect('/user_shop'))
                                })
                        }
                    })
            } else {
                Product.findOne({ _id: ObjectId(req.query.id) })
                    .then((product) => {
                        // console.log(product);
                        let cart = new Cart({
                            owner: user,
                            items: [{
                                itemId: product._id,
                                productName: product.productName,
                                quantity: 1,
                                price: product.discountPrice,
                                category: product.category,
                                image1: product.image1
                            }]
                        })
                        cart.bill = cart.items[0].quantity * cart.items[0].price
                        cart.save()
                            .then(() => res.redirect('/user_shop'))
                    })
            }
        })
}
exports.cartOperation = (req, res) => {
    Cart.findOne({ owner: req.session.userId })
        .then((oldCart) => {
            let operations = (cartItem) => {
                let newCart = oldCart

                let indexOfOldItem = 0;
                for (let i = 0; i < newCart.items.length; i++) {
                    if (req.query.id.includes(newCart.items[i].itemId)) {
                        indexOfOldItem = i;
                        break;
                    }
                }
                if (cartItem[0].quantity > 0) {
                    newCart.items.splice(indexOfOldItem, 1, cartItem[0]);
                    Cart.replaceOne({ owner: oldCart.owner }, {
                        owner: newCart.owner,
                        items: newCart.items,
                        bill: cart.bill
                    })
                        .then(() => {
                            res.redirect('/user_cart')
                        })
                }
                else {
                    newCart.items.splice(indexOfOldItem, 1);
                    Cart.replaceOne({ owner: oldCart.owner }, {
                        owner: newCart.owner,
                        items: newCart.items,
                        bill: cart.bill
                    })
                        .then(() => {
                            Cart.findOne({ owner: oldCart.owner })
                                .then((result) => {
                                    if (result.items.length < 1) {
                                        Cart.deleteOne({ owner: oldCart.owner })
                                            .then(() => {
                                                res.redirect('/user_cart')
                                            })
                                    } else {
                                        res.redirect('/user_cart')
                                    }
                                })
                        })
                }
            }
            let cart = new CartProduct(oldCart)
            if (req.query.add) {
                let cartItem = cart.add(req.query.id)
                cartItem.then((cartItem) => {
                    operations(cartItem);
                })
            } else {
                let cartItem = cart.subtract(req.query.id)
                cartItem.then((cartItem) => {
                    operations(cartItem);
                })
            }
        })
}

exports.deleteFromCart = (req, res) => {
    Cart.findOne({ owner: req.session.userId })
        .then((result) => {
            let indexOfOldItem = 0;
            for (let i = 0; i < result.items.length; i++) {
                if (req.query.id.includes(result.items[i].itemId)) {
                    indexOfOldItem = i;
                    break;
                }
            }
            let cartBill = +result.bill - +result.items[indexOfOldItem].price
            result.items.splice(indexOfOldItem, 1);
            Cart.replaceOne({ owner: result.owner }, {
                owner: result.owner,
                items: result.items,
                bill: cartBill
            })
                .then(() => {
                    Cart.findOne({ owner: req.session.userId })
                        .then((result) => {
                            if (result.items.length < 1) {
                                Cart.deleteOne({ owner: req.session.userId })
                                    .then(() => {
                                        res.redirect('/user_cart')
                                    })
                            } else {
                                res.redirect('/user_cart')
                            }
                        })
                })
        })
}
//wishlist
exports.wishList = (req, res) => {
    const id = req.query.id
    let user = req.session.userId
    if (user) {
        User.findOne({ email: user }, { email: 1 })
            .then((docs) => {
                if (docs) {
                    WishList.findOne({ productid: id, userid: user })
                        .then((result) => {
                            if (result) {
                                console.log("Alredy added");
                                res.redirect('/user_shop')
                            } else {
                                Product.findOne({ _id: ObjectId(id) }, { productName: 1, discountPrice: 1, image1: 1, _id: 1 })
                                    .then((result) => {
                                        // console.log(result)

                                        const wishlistdetails = new Wishlist({
                                            userid: user,
                                            productName: result.productName,
                                            price: result.discountPrice,
                                            image1: result.image1,
                                            productid: result._id,
                                            quantity: 1
                                        })
                                        // console.log(wishlistdetails);
                                        wishlistdetails.save()

                                            .then(() => {
                                                console.log('wishlish added')
                                                res.redirect('/user_shop')
                                            })
                                            .catch((err) => {
                                                console.log(err)
                                            })
                                    })
                            }
                        })
                }
            })
    } else {
        res.redirect('/user_home')
    }
}

exports.userWishList = (req, res) => {
    if (req.session.userId) {
        let userId = req.session.userId
        //   console.log(userId);
        WishList.find({ userid: userId })
            .then((docs) => {

                //   console.log(docs);
                if (docs) {
                    res.render('user/wishlist', { docs })
                }
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        res.redirect('/user_shop')
    }
}
exports.removewish = (req, res) => {
    let proId = req.query.id
    Wishlist.findOneAndDelete({ _id: ObjectId(proId) })
        .then(() => {
            res.redirect('/user_wishlist')
        })
        .catch((err) => {
            console.log(err);
        })
}

//coupon
// exports.adminCoupon=(req,res)=>{
// Coupon.find().then((coupon)=>{
//     res.render('admin/coupon',{coupon})
// })
//}

exports.adminCoupon = (req, res) => {
    Coupon.find()
        .then((coupon) => {

            res.render('admin/coupon', { coupon, validation })
            validation.existingCoupon = false
        })
}


exports.addCoupon = (req, res) => {

    Coupon.findOne({ couponCode: req.body.coupencode })
        .then((result) => {
            if (result) {
                validation.existingCoupon = true
                res.redirect('/home/coupon')
            } else {
                let coupon = new Coupon({
                    couponCode: req.body.coupencode,
                    couponValue: req.body.coupenvalue,
                    minBill: req.body.minbill,
                    couponExpiry: req.body.expirydate,
                    status: 'Active'
                })
                coupon.save()
                    .then(() => {
                        res.redirect('/home/coupon')
                    })
            }
        })
}


exports.deleteCoupon = (req, res) => {
    cop = req.query.id
    console.log(cop);
    Coupon.deleteOne({ couponCode: cop })
        .then(() => {
            res.redirect('/home/coupon')
        })
}






//checkout page
// exports.checkout=(req,res)=>{
//     let user= req.session.userId
//     User.findOne({email:user},{address:1,_id:1})
//     .then((address)=>{
//         // console.log(address)
//         Cart.findOne({email:user},{items:1,bill:1})
//         .then((result)=>{
//             res.render('user/checkout',{address,result})
//         })
//     })
// }



exports.checkout = (req, res) => {
    User.findOne({ email: req.session.userId }, { address: 1, _id: 1 })
        .then((value) => {

            Cart.findOne({ owner: req.session.userId }, { items: 1, bill: 1 })
                .then((cartItems) => {
                    if (cartItems) {
                        Category.find()
                            .then(object => {
                                if (value.address.length === 0) {
                                    res.render('user/addnewaddress', { cartItems, value, object })

                                } else {

                                    res.render('user/checkout', { cartItems, value, object, validation })
                                    validation.validCoupon = false
                                    validation.usedCoupon = false
                                    validation.dateExpiry = false
                                    validation.amountMin = false
                                }
                            }).catch((err) => console.log(err))
                    } else {
                        Category.find()
                            .then(object => {
                                res.render('user/addnewaddress', { cartItems, value, object })
                            })
                    }
                }).catch((err) => console.log(err))
        }).catch((err) => console.log(err))
}



exports.newAddress = (req, res) => {
    res.render('user/addnewaddress')
}

exports.addAddress = (req, res) => {
    let user = req.session.userId
    // console.log(user)
    User.updateOne({ email: user }, {
        $push: {
            address: {
                name: req.body.name,
                mobile: req.body.mobile,
                address1: req.body.address1,
                address2: req.body.address2,
                city: req.body.city,
                state: req.body.state,
                zip: req.body.zip
            }
        }
    })
        .then((result) => {
            //    console.log(result)
            res.redirect('/checkoutPage')
        })
}

// exports.deleteAddress=(req,res)=>{
//             add=req.query.id
//             User.address[i].deleteOne({selectedAddress:add})
//             .then(()=>{
//                 res.redirect('/checkoutPage')
//             })
//         }



exports.payment = (req, res) => {

    function createOrder(cart, user) {
        const newOrder = {
            user: cart.owner,
            items: cart.items,
            address: user.address[addressIndex],
            cartBill: cart.bill,
            couponCode: coupon.couponCode || '',
            couponValue: coupon.couponValue || '',
            orderBill: orderBill || cart.bill,
            paymentMethod: paymentMethod,
            orderDate: new Date(),
        }
        req.session.order = newOrder
    }

    const paymentMethod = req.body.paymentType
    console.log(paymentMethod)
    const addressIndex = +req.body.selectedAddress
    const orderBill = req.body.Bill
    console.log(orderBill)
    const userId = req.session.userId
    console.log(userId);
    const coupon = req.session.coupon || {}

    orderHelpers.findUser(userId)
        .then((user) => {
            return orderHelpers.findCart(user)
        })
        .catch((err) => {
            // console.log(err.message)
        })
        .then(([cart, user]) => {
            if (paymentMethod === "cod") {
                createOrder(cart, user)
                res.json({ codSuccess: true, value: paymentMethod })
            } else if (paymentMethod === "paypal") {
                createOrder(cart, user)
                res.json({ paypal: true })
            } else if (paymentMethod === "razorpay") {
                createOrder(cart, user)
                res.redirect('/razorpay')
            }
        })
        .catch((err) => {
            console.log(err)
        })

}


exports.purchase = ((req, res) => {
    const order = req.session.order
    const coupon = req.session.coupon || ''
    const userId = req.session.userId
    order.items.forEach((items) => {
        items.orderStatus = "processed"
    })

    orderHelpers.updateStock(order.items)
        .then(() => {
            console.log("upadate stock")
            return orderHelpers.createOrder(order)
        })
        .catch((err) => {
            console.log(err)
        })
        .then(() => {

            if (coupon) {
                return orderHelpers.couponUpdate(coupon, userId)
            } else {
                return
            }
        })
        .catch((err) => {
            console.log(err)
        })
        .then(() => {
            console.log("couponUpdate")
            return orderHelpers.deleteCart(userId)
        })
        .catch((err) => {
            console.log(err)
        })
        .then(() => {
            console.log('deleteCart')
            return orderHelpers.findCategory()
        })
        .catch((err) => {
            console.log(err)
        })
        .then((object) => {
            console.log("orderCreated")
            res.render('user/paymentok', { object })
        })
        .catch((err) => {
            console.log(err)
        })
})



// exports.success = (req,res)=> {
//     res.render('user/paymentok')
// }


exports.razorpay = (req, res) => {
    const bill = Order.findOne({ owner: req.session.userId })
        .then((cart) => {
            return cart.orderBill
        })
    bill.then((totalBill) => {
        // console.log(totalBill)
        const razorpay = new Razorpay({
            key_id: `${process.env.RAZORPAY_KEY_ID}`,
            key_secret: `${process.env.RAZORPAY_KEY_SECRET}`
        })

        let options = {
            amount: totalBill * 100,  // amount in the smallest currency unit
            currency: "INR"
        };

        razorpay.orders.create(options, function (err, order) {
            // console.log(order);
            res.json({ razorpay: true, order });
        });
    })
}

exports.paypal = (req, res) => {
    let billAmount = Order.findOne({ owner: req.session.userId })
        .then((cart) => {
            return cart.orderBill;
        })
    billAmount.then((bill) => {
        bill = Math.round(+bill * 0.01368)
        //    console.log(bill);

        Paypal.configure({
            'mode': 'sandbox', //sandbox or live 
            'client_id': 'AUPXkv8ZMgQ_cqifw2aQqOeW75It2MpTcX7R4epFjBAnydpYV9f1GTU51nPXOFdDGzWKaZjbFQrSJPLu',
            // please provide your client id here 
            'client_secret': 'EGY_Y1YVGhGNXopbuf1pvFM31HHpWj4qtFH33Ajz045zkbJWBaBQTW1P-6NpvNGCQVpsPJiOBHHdZYmn' // provide your client secret here 
        });

        // create payment object 
        let payment = {
            "intent": "authorize",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": 'http://localhost:4000/payment/purchase',
                "cancel_url": "http://127.0.0.1:3000/err"
            },
            "transactions": [{
                "amount": {
                    "total": `${+bill}`,
                    "currency": "USD"
                },
                "description": " a book on mean stack "
            }]
        }

        let createPay = (payment) => {
            return new Promise((resolve, reject) => {
                Paypal.payment.create(payment, function (err, payment) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(payment);
                    }
                });
            });
        }

        // call the create Pay method 
        createPay(payment)
            .then((transaction) => {
                // console.log(transaction)
                var id = transaction.id;
                var links = transaction.links;
                var counter = links.length;
                while (counter--) {
                    if (links[counter].method == 'REDIRECT') {
                        // console.log(transaction);
                        // redirect to paypal where user approves the transaction 
                        return res.redirect(links[counter].href)
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                res.redirect('/err');
            });


    })
}

exports.userProfile = (req, res) => {
    let user = req.session.userId
    User.findOne({ email: user })
        .then((profile) => {
            res.render('user/profile', { profile })
        })
}
exports.orderUser = (req, res) => {
    let user = req.session.userId
    Order.find({ user: user }).then((docs) => {
        res.render('user/orderUser', { docs })
    })
    // res.render('user/orderUser')
}

exports.cancelUserOrder = (req, res) => {
    let id = req.query.id
    Order.updateOne({ _id: ObjectId(id) }, { $set: { orderStatus: "cancelled" } })
        .then(() => {
            res.redirect('/profile/orders')
        })
}
exports.userdDeleteOrder = (req, res) => {
    let id = req.query.id
    //console.log(id)
    Order.deleteOne({ _id: ObjectId(id) }).then(() => {
        res.redirect('/profile/orders')
    })
}

exports.viewOrders = (req, res) => {
    let id = req.query.id

    Order.findOne({ _id: ObjectId(id) })
        .then((result) => {
            docs = result
            // orderDet = docs.orderDetails
            // orderItems = orderDet[0].items
            // console.log(docs)
            res.render('user/order-viewdetails', { docs })
        })
}
exports.editPro = (req, res) => {
    let user = req.session.userId
    User.findOne({ email: user })
        .then((result) => {
            res.render('user/edit-profile', { result })
        })
}
exports.profileEdit = (req, res) => {
    let profileId = req.query.id
    const files = req.files
    User.updateOne({ _id: ObjectId(profileId) }, {
        $set: {
            name: req.body.name,
            email: req.query.email,
            mobile: req.body.phone,
            profileImage: req.files[0] && req.files[0].filename ? req.files[0].filename : " ",
        }
    }).then((result) => {
        res.redirect('/user_profile')
    })
}
exports.category = (req, res) => {
    Category.find()
        .then((categories) => {
            res.render('admin/category', { categories, validation })
            validation.category = false
        }).catch((err) => {
            console.log(err)
        })
}
exports.addCategory = (req, res) => {
    Category.findOne({ category: req.body.category })
        .then((result) => {
            if (result) {

                validation.cateogry = true
                res.redirect('/category-management')
            }
            else {
                let category = new Category({
                    category: req.body.category
                })
                category.save()
                    .then(() => {
                        res.redirect('/category-management')
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        }).catch((err) => {
            console.log(err)
        })
}
exports.deleteCategory = (req, res) => {
    const id = req.query.id;
    Category.deleteOne({ _id: ObjectId(id) })
        .then(() => {
            res.redirect('/category-management')

        }).catch((err) => console.log(err))
}
//order confirm
exports.confirmedOrders = (req, res) => {
    Order.updateOne({ _id: req.query.id }, { $set: { orderStatus: "confirmed" } })
        .then(() => {
            res.redirect('/admin-order')
        })
}
exports.deliverOrder = (req, res) => {
    Order.updateOne({ _id: req.query.id }, { $set: { orderStatus: "delivered" } })
        .then(() => {
            res.redirect('/admin-order')
        })
}
exports.canceledOrder = (req, res) => {
    Order.updateOne({ _id: req.query.id }, { $set: { orderStatus: "cancel" } })
        .then(() => {
            res.redirect('/admin-order')
        })
}
// productView
exports.viewOrder = (req, res) => {
    Order.find({ orderStatus: "New" })
        .then((result) => {
            //  console.log(result)
            res.render('admin/vieworder', { result })
        })
}
exports.viewOrderProduct = (req, res) => {
    let orderDet = []
    let orderItems = []
    Order.findOne({ _id: req.query.id })
        .then((viewOrder) => {
            // console.log(viewOrder);
            orderItems = viewOrder.items
            // console.log(orderDet);

            res.render('admin/orderViewProducts', { orderItems, viewOrder })
        })
}
exports.confirmedOrder = (req, res) => {
    Order.find({ orderStatus: "confirmed" })
        .then((result) => {
            console.log(result)
            res.render('admin/vieworder', { result })
        })
}
exports.deliveredOrder = (req, res) => {
    Order.find({ orderStatus: "delivered" })
        .then((result) => {
            res.render('admin/vieworder', { result })
        })
}
exports.canceledorder = (req, res) => {
    Order.find({ orderStatus: "cancel" })
        .then((result) => {
            res.render('admin/vieworder', { result })
        })
}
exports.errPage = (req, res) => {
    res.render('user/404Page')
}
exports.applyCoupon = (req, res) => {
    let coupon = (req.body.couponcode).toUpperCase()
    console.log(coupon);
    Cart.findOne({ owner: req.session.userId })
        .then((cart) => {
            Coupon.findOne({ couponCode: coupon })
                .then((coupons) => {
                    if (coupons) {
                        Coupon.findOne({ couponCode: req.body.couponcode, users: req.session.userId })
                            .then((usedCoupon) => {
                                if (usedCoupon) {

                                    validation.usedCoupon = true
                                    // res.redirect('/cart')
                                    res.json({})
                                } else {

                                    if (coupons.couponExpiry >= Date.now()) {
                                        if (coupons.minBill >= cart.bill) {
                                            validation.amountMin = true
                                            // res.redirect('/cart')   
                                            res.json({})
                                        } else {
                                            req.session.coupon = coupons
                                            res.json({ couponValue: coupons.couponValue, couponCode: coupons.couponCode })
                                        }
                                    } else {
                                        validation.dateExpiry = true
                                        // res.redirect('/cart')  
                                        res.json({})
                                    }
                                }

                            }).catch((err) => console.log(err))
                    } else {
                        validation.validCoupon = true
                        // res.redirect('/cart')  
                        res.json({})
                    }
                })

        })


}
