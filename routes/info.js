const express = require('express');
const router = express.Router();

const admin_controller = require('../controller/admincontroller');
const user_controller = require('../controller/usercontroller');
//const duo_controller = require('./controllers/duoController');



router.get('/',admin_controller.index);

router.get('/admin',admin_controller.adminlogin);

router.post('/admin/adminauth', admin_controller.adminpage);

router.get('/admin/books/booknew', admin_controller.book_create_get);

router.post('/admin/books/create', admin_controller.book_create_post);

router.get('/admin/edit/(:id)', admin_controller.book_edit_get);

router.post('/admin/update/:id', admin_controller.book_edit_post);

router.get('/admin/delete/(:id)', admin_controller.book_delete);

router.get('/books', admin_controller.book_list);

router.get('/userlog',user_controller.userlogin);

router.post('/user/userauth', user_controller.userpage);

router.get('/user/search',user_controller.search);

router.get('/userbooks', user_controller.userbook_list);


module.exports = router;

