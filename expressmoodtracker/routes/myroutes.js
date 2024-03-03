const express = require('express');
const controller = require('./../controllers/mycontroller');

const router = express.Router();

router.get('/', controller.getAllFavourites);
router.get('/editfav', controller.getEditFavourites);
router.get('/editfav/:id', controller.getEditSingleFavourite);
router.get('/delfav/:id', controller.getDeleteSingleFavourite);
router.get('/newfav', controller.getAddFavourite);

router.post('/newfav', controller.postInsertFavourite);
router.post('/editfav/:id', controller.postUpdateFavourite);
router.post('/delfav/:id', controller.postDeleteFavourite);

module.exports = router;