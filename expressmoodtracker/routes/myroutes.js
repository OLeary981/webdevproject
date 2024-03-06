const express = require('express');
const controller = require('./../controllers/mycontroller');
const { isAuth } = require('./../middleware/auth');
const { check } = require('express-validator');

const router = express.Router();

router.get('/', controller.getAllFavourites);
router.get('/editfav', isAuth, controller.getEditFavourites);
router.get('/editfav/:id', isAuth, controller.getEditSingleFavourite);
router.get('/delfav/:id', isAuth, controller.getDeleteSingleFavourite);
router.get('/newfav', isAuth, controller.getAddFavourite);
router.get('/newsnapshot', controller.getAddSnapshot); //need to add isauth to this later
router.get('/columns', controller.getColumns);

router.get('/register', controller.getRegisterUser)
router.get('/login', controller.getLogin);
router.get('/logout', controller.getLogout);

router.post('/newfav', controller.postInsertFavourite);
router.post('/editfav/:id', controller.postUpdateFavourite);
router.post('/delfav/:id', controller.postDeleteFavourite);
router.post('/register', controller.postRegisterUser);

//router.post('/login', controller.postLogin);

router.post('/login',
    check('username')
    .exists()
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 chars!'),
    controller.postLoginBcrypt);

module.exports = router;