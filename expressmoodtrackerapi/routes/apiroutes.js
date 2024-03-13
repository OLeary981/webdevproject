const express = require('express');
const controller = require('./../controllers/apicontrollerv2');

const router = express.Router();

router.get('/favourites', controller.getFavourites);
router.get('/triggers', controller.getTriggers);
router.get('/snapshots/:id', controller.getUserSnapshots);





module.exports = router;