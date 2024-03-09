exports.navbarMiddleware = (req, res, next) => {
    // Check if the user is logged in
    res.locals.isLoggedIn = req.session.isLoggedIn || false;
    res.locals.currentPage = req.path;
    console.log("navbar script accessed")
    next();
};

