const express = require("express");
const controller = require("./../controllers/mycontroller");
const { isAuth } = require("./../middleware/auth");
const { check } = require("express-validator");

const router = express.Router();





router.get("/", controller.getIndex);
router.get("/about", controller.getAbout);
router.get("/register", controller.getRegisterUser);
router.get("/login", controller.getLogin);
router.get("/logout", controller.getLogout);
router.get("/landing", controller.getLanding);
router.get("/allsnapshots", isAuth, controller.getAllSnapshotsSimplified);
router.get("/newsnapshot", isAuth, controller.getAddSnapshot);
router.get("/singlesnapshot/:id", isAuth, controller.getSingleSnapshot);
router.get("/editsnapshotcheckbox/:id", isAuth, controller.getEditSnapshot);


router.post("/delsnapshot/:id", controller.postDeleteSnapshot);
router.post(
  "/register",
  check("username")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 chars!"),
  controller.postRegisterUser
);
router.post("/newsnapshot", controller.postAddSnapshot);
router.post("/editsnapshot/:id", controller.postEditSnapshot);

//router.post('/login', controller.postLogin);

router.post(
  "/login",
  check("username")
    .exists()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 chars!"),
  controller.postLoginBcrypt
);

module.exports = router;
