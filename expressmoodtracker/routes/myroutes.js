const express = require("express");
const user_controller = require("./../controllers/user_controller");
const snapshot_controller = require("./../controllers/snapshot_controller");
const { isAuth } = require("./../middleware/auth");
const { check } = require("express-validator");

const router = express.Router();


router.get("/", snapshot_controller.getIndex);
router.get("/about", snapshot_controller.getAbout);
router.get("/landing", snapshot_controller.getLanding);
router.get("/allsnapshots", isAuth, snapshot_controller.getAllSnapshotsSimplified);
router.get("/newsnapshot", isAuth, snapshot_controller.getAddSnapshot);
router.get("/singlesnapshot/:id", isAuth, snapshot_controller.getSingleSnapshot);
router.get("/editsnapshotcheckbox/:id", isAuth, snapshot_controller.getEditSnapshot);
router.post("/delsnapshot/:id", snapshot_controller.postDeleteSnapshot);
router.post("/newsnapshot", snapshot_controller.postAddSnapshot);
router.post("/editsnapshot/:id", snapshot_controller.postEditSnapshot);


router.get("/register", user_controller.getRegisterUser);
router.get("/login", user_controller.getLogin);
router.get("/logout", user_controller.getLogout);
router.post(
  "/register",
  check("username")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 chars!"),
  user_controller.postRegisterUser
);


//router.post('/login', controller.postLogin);

router.post(
  "/login",
  check("username")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 chars!"),
  user_controller.postLoginBcrypt
);

module.exports = router;
