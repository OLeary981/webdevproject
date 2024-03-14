const express = require("express");
const snapshotController = require("../controllers/apisnapshotcontroller");
const userController = require("../controllers/apiusercontroller");

const router = express.Router();

router.get("/triggers", snapshotController.getTriggers); //used by add snapshot
router.get("/snapshots/:id", snapshotController.getUserSnapshots); //used by overview
router.get("/singlesnapshot/:id/:user_ID", snapshotController.getSingleSnapshot); //used for single snapshot view
router.get( "/editsinglesnapshot/:id/:user_ID", snapshotController.getEditSingleSnapshotv2); //used in app
router.delete("/deletesinglesnapshot/:id/:user_ID", snapshotController.deleteSnapshot);
router.post("/newsnapshot", snapshotController.postAddSnapshot);
router.put("/editsnapshot/:id", snapshotController.updateSnapshot);


router.post("/userdetails", userController.postLogin);
router.post("/registeruser", userController.postRegisterUser);

module.exports = router;
