const conn = require('./../util/dbconn');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');


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

exports.getRegisterUser = (req, res) => {
    res.render('register'); //add protection etc so can only register if not logged in?
}


exports.getLogin = (req, res) => {
    const { isLoggedIn } = req.session;
    res.render('login', {currentPage: '/login', isLoggedIn, error: null });
};

exports.getAddSnapshot = (req, res) => {
    res.render('addsnapshot');
}

exports.getColumns = (req, res) => {
    res.render('columns');
}

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

    const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? 
                            AND user_details.user_password = ?`;

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

exports.postLoginBcrypt = (req, res) => {
    const { isLoggedIn } = req.session;
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

    const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? `;

    conn.query( checkuserSQL, vals, (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error checking username'); //consider changing this to something more graceful
        }
       

        if (rows.length === 0) {
            return res.redirect('/login?error=User not found');
        }

        const hashedPassword = rows[0].user_password;

        bcrypt.compare(userpass, hashedPassword, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error comparing passwords');
                }

                if (result) {
                    const session = req.session;
                    session.isLoggedIn = true;
                    console.log(`postLogin: session: ${session}`);


                     var orig_route = session.route;
                    console.log(`postLogin: orig_route: ${orig_route}`);
                    if (!orig_route) {
                        orig_route = '/';
                         }
                    return res.redirect(orig_route);





                } else {
                    return res.render('login', { currentPage: '/login', error: 'Incorrect password', isLoggedIn });
                }
            });
        });
    };

exports.postRegisterUser = (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    console.log(password);

    // Hash password
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error hashing password');
            return;
        }
        const insertSQL = 'INSERT INTO user_details (username, user_password) VALUES (?, ?)';
        // Insert user into database - NEED TO ADD CHECK THAT THE USER IS NOT ALREADY REGISTERED?
        const newUser = { username, password: hash };
        conn.query(insertSQL, [newUser.username, newUser.password], (error, rows) => {
            if (error) {
                console.error(error);
                res.status(500).send('Error registering user');
                return;
            }
            res.redirect('/login');
        });
    });
};