
exports.isAuth = (req, res, next) => {
    const { isLoggedIn } = req.session;

    if (!isLoggedIn) {
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    }

    next();
};

