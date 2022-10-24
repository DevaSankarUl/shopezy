const express=require('express')

const services=require('../controller/render')
const store = require('../middlewares/multer')

const router=express.Router()

router.get('/admin_panel',services.adminLoggedIn,services.adminPanel)
router.post('/test',services.test)
router.get('/admin/exportExcel',services.exportExcel)
router.get('/admin_logout',services.adminLogout)

router.get('/user-management',services.adminLoggedIn,services.adminUsers)

router.get('/admin_signin',services.adminLoggedOut,services.adminLoginRouter)
router.post('/admin_signin',services.adminlogin);

router.post('/admin_panel/user-management/block',services.userBlock)
router.post('/admin_panel/user-management/unblock',services.userUnblock)

router.get('/product',services.productTable)
router.get('/product_table',services.addproduct)
router.get('/add_product/edit_product',services.editProduct)
router.get('/add_product/delete_product',services.deleteProduct)


router.post('/admin_panel/add_product',store.any(),services.addProducts)
router.post('/admin_panel/add_product/update',store.any(),services.UpdateProduct)

router.get('/category-management',services.category)
router.post('/admin-panel/category',services.addCategory)
router.post('/admin/delete-category',services.deleteCategory)

router.get('/admin-order',services.adminLoggedIn,services.viewOrder)
router.get('/admin-order/view-products',services.adminLoggedIn,services.viewOrderProduct)
router.get('/admin-order/confirm',services.adminLoggedIn,services.confirmedOrder)
router.get('/admin-order/cancel-order',services.canceledorder)
router.get('/admin-order/delivered',services.adminLoggedIn,services.deliveredOrder)

router.get('/admin-order/orderconfirmed',services.confirmedOrders)
router.get('/admin-order/delilvierdOrder',services.deliverOrder)
router.get('/admin-order/cancelOrder',services.canceledOrder)

//coupon
router.get('/home/coupon',services.adminCoupon)
router.post('/coupen/add-coupen',services.addCoupon)
router.post('/coupen/delete-coupon',services.deleteCoupon)
router.get('/404Page',services.errPage)
module.exports = router