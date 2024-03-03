const conn = require('./../util/dbconn');
const { validationResult } = require('express-validator');

//GET /
/*
exports.getAllFavourites = (req, res) => {

    const selectSQL = 'SELECT * FROM favourites';

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('index', { result: rows });
        }
    });
};
*/

exports.getAllFavourites = (req, res) => {

    const { isLoggedIn } = req.session;

    const selectSQL = 'SELECT * FROM favourites';

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.log(rows);

            var countmeat = 0;
            var countfish = 0;
            var countveg = 0;
            var countdesert = 0;

            rows.forEach((row) => {
                const fav = row.favourite;
                if (fav === 'Meat') {
                    countmeat++;
                } else if (fav === 'Fish') {
                    countfish++;
                } else if (fav === 'Vegetables') {
                    countveg++;
                } else if (fav === 'Desert') {
                    countdesert++;
                }

            });

            const vals = [ countmeat, countfish, countveg, countdesert ];

            res.render('index', {currentPage: '/', result: rows, vals, isLoggedIn });
        }
    });
};

//added GET /editfav route method
exports.getEditFavourites = (req, res) => {
    const { isLoggedIn } = req.session;
    /*
    const { isLoggedIn } = req.session;

    if (!isLoggedIn) {
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    }
    */

    const selectSQL = 'SELECT * FROM favourites';

    conn.query(selectSQL, (err, rows) => {   
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('editfavourites', { currentPage: '/editfav', result: rows, isLoggedIn });
        }
    });
};

//added GET /editfav/:id route method
exports.getEditSingleFavourite = (req, res) => {
    const { isLoggedIn } = req.session;
    /*
    const { isLoggedIn } = req.session;

    if (!isLoggedIn) {
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    }
    */

    const { id } = req.params;
    const selectSQL = `SELECT * FROM favourites WHERE id = ${id}`;

    conn.query(selectSQL, (err, rows) => {   
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('editsinglefavourite', { result: rows, isLoggedIn });
        }
    });
};

exports.getDeleteSingleFavourite = (req, res) => {
    const { isLoggedIn } = req.session;
    /*
    const { isLoggedIn } = req.session;

    if (!isLoggedIn) {
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    }
    */

    const { id } = req.params;
    const selectSQL = `SELECT * FROM favourites WHERE id = ${id}`;

    conn.query(selectSQL, (err, rows) => {   
        if (err) {
            throw err;
        } else {
            console.log(rows);
            res.render('deletesinglefavourite', { result: rows, isLoggedIn });
        }
    });
};


exports.getAddFavourite = (req, res) => {
    const { isLoggedIn } = req.session;
    /*
    const { isLoggedIn } = req.session;

    if (!isLoggedIn) {
        req.session.route = req.originalUrl;
        return res.redirect('/login');
    }
    */
    
    res.render('addfavourite', {currentPage: '/newfav', isLoggedIn});
};

exports.postInsertFavourite = (req, res) => {
    const data = req.body;
    console.log(data);

    const { myname, myfoodtype } = req.body;
    const vals = [ myname, myfoodtype ];
    
    const insertSQL = 'INSERT INTO favourites (person, favourite) VALUES (?, ?)';

    conn.query(insertSQL, vals, (err, rows) => {
        if (err) {
            throw err;
        } else {
            res.redirect('/');
        }
    });
};

exports.postUpdateFavourite = (req, res) => {

    console.log(req.params);
    console.log(req.body);

    const { id } = req.params;
    const { myname, myfoodtype } = req.body;
    const vals = [ myfoodtype ];

    const updateSQL = `UPDATE favourites SET favourite = ? WHERE id = ${id}`;
    conn.query(updateSQL, vals, (err, rows) => {
        if (err) throw err;

        res.redirect('/editfav');
    });
};

exports.postDeleteFavourite = (req, res) => {

    const { id } = req.params;

    const deleteSQL = `DELETE FROM favourites WHERE id = ${id}`;
    conn.query(deleteSQL, (err, rows) => {
        if (err) throw err;

        res.redirect('/editfav');
    });
};

/////////////////////////////////////////
// New methods
exports.getLogin = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render('login', {currentPage: '/login', isLoggedIn, error: null });
};

exports.getLogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
};

exports.postLogin = (req, res) => {

    const errors = validationResult(req);
    console.log(errors.array());
    if (!errors.isEmpty()) {
        return res.status(422).render('login', { error: errors.array()[0].msg });
    }

    const { username, userpass } = req.body;
    const vals = [ username, userpass ];
    console.log(`postLogin vals: ${vals}`);

    /*
    const checkuserSQL = `SELECT * FROM favourites_users WHERE favourites_users.username = '${ username }' 
                            AND favourites_users.password = '${ userpass }'`;
    */

    const checkuserSQL = `SELECT * FROM favourites_users WHERE favourites_users.username = ? 
                            AND favourites_users.password = ?`;

    conn.query( checkuserSQL, vals, (err, rows) => {
        if (err) throw err;

        if (rows.length > 0) {
            const session = req.session;
            session.isLoggedIn = true;
            console.log(`postLogin: session: ${session}`);


            var orig_route = session.route;
            console.log(`postLogin: orig_route: ${orig_route}`);

            if (!orig_route) {
                orig_route = '/';
            }
            res.redirect(`${orig_route}`);


            //res.redirect('/');
        } else {
            res.redirect('/');
        }
    });
};