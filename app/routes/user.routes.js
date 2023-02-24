const controller = require('../controllers/user.controller');
const { authJwt } = require("../middleware");


module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    })

    app.get("/api/get/today", [authJwt.verifyToken], controller.getTodayQuota);
    // app.post("/api/add/table", controller.addtable);

    app.get("/api/get/cheat/:id", [authJwt.verifyToken], controller.getCheatData);

    app.get("/api/get/food/:id", [authJwt.verifyToken], controller.getFoodData);

    app.post("/api/update/daily",[authJwt.verifyToken],controller.updateDailySelect);

    app.get("/api/get/daily_coupon", [authJwt.verifyToken],controller.getSelectedCoupon);

    app.post("/api/update/user", [authJwt.verifyToken], controller.updateUser);

    app.get("/api/get/user", [authJwt.verifyToken], controller.getUserData);
}