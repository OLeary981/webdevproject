const express = require('express');
const controller = require('./../controllers/apicontrollerv2');

const router = express.Router();


router.get('/triggers', controller.getTriggers); //used by add snapshot
router.get('/snapshots/:id', controller.getUserSnapshots); //used by overview
router.get('/singlesnapshot/:id/:user_ID', controller.getSingleSnapshot); //used for single snapshot view
//router.get('/chosentriggers/:id', controller.getChosenTriggers); //not currently in use.
router.get('/editsinglesnapshot/:id/:user_ID', controller.getEditSingleSnapshotv2); //used in app for edit snapshot

router.delete('/deletesinglesnapshot/:id/:user_ID', controller.deleteSnapshot);
router.post('/newsnapshot', controller.postAddSnapshot);
router.put('/editsnapshot/:id', controller.updateSnapshot);



module.exports = router;