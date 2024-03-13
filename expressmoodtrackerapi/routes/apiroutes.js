const express = require('express');
const controller = require('./../controllers/apicontrollerv2');

const router = express.Router();

router.get('/favourites', controller.getFavourites);
router.get('/triggers', controller.getTriggers);
router.get('/snapshots/:id', controller.getUserSnapshots);
router.get('/singlesnapshot/:id/:user_ID', controller.getSingleSnapshot);
router.get('/chosentriggers/:id', controller.getChosenTriggers);





module.exports = router;