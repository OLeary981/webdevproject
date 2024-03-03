const conn = require('./../utils/dbconn');

// GET /favourites
exports.getFavourites = (req, res) => {

    const selectSQL = 'SELECT * FROM favourites';

    conn.query(selectSQL, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        } else {
            res.status(200);
            res.json({
                status: 'success',
                message: `${rows.length} records returned`,
                result: rows
            });
        }
    });
};

//GET /favourites/:id
exports.getFavourite = (req, res) => {

    const { id } = req.params;
    const selectSQL = `SELECT * FROM favourites WHERE id = ${id}`;

    conn.query(selectSQL, (err, rows) => {   
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        } else {
            if (rows.length > 0) {
                res.status(200);
                res.json({
                    status: 'success',
                    message: `Record ID ${id} retrieved`,
                    result: rows
                });
            } else {
                res.status(404);
                res.json({
                    status: 'failure',
                    message: `Invalid ID ${id}`
                });
            }
        }
    });
};

// POST /favourites
exports.insertFavourite = (req, res) => {

    const { myname, myfoodtype } = req.body;
    const vals = [ myname, myfoodtype ];
    
    const insertSQL = 'INSERT INTO favourites (person, favourite) VALUES (?, ?)';

    conn.query(insertSQL, vals, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        } else {
            res.status(201);
            res.json({
                status: 'success',
                message: `Record ID ${rows.insertId} added`
            });
        }
    });
};

//PUT /favourites/:id
exports.updateFavourite = (req, res) => {

    const { id } = req.params;
    const { myname, myfoodtype } = req.body;
    const vals = [ myname, myfoodtype, id ];

    const updateSQL = `UPDATE favourites SET person = ?, favourite = ? WHERE id = ${id}`;
    conn.query(updateSQL, vals, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        } else {
            if (rows.affectedRows > 0) {
                res.status(200);
                res.json({
                    status: 'success',
                    message: `Record ID ${id} updated`
                });
            } else {
                res.status(404);
                res.json({
                    status: 'failure',
                    message: `Invalid ID ${id}`
                });
            }
        }
    });
};

//DELETE /favourites/:id
exports.deleteFavourite = (req, res) => {

    const { id } = req.params;

    const deleteSQL = `DELETE FROM favourites WHERE id = ${id}`;
    conn.query(deleteSQL, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: 'failure',
                message: err
            });
        } else {
            if (rows.affectedRows > 0) {
                res.status(200);
                res.json({
                    status: 'success',
                    message: `Record ID ${id} deleted`
                });
            } else {
                res.status(404);
                res.json({
                    status: 'failure',
                    message: `Invalid ID ${id}`
                });
            }
        }
    });
};
