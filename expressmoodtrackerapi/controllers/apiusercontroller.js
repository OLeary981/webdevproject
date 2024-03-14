const conn = require('./../util/dbconn');
//tested and working in postman
exports.postLogin = (req, res) => {
    const { username} = req.body;
    const vals = [username];
    const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? `;
    
    conn.query(checkuserSQL, vals, (err, rows) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else {
            console.log(`Length = ${rows.length}`);
            if (rows.length > 0) {
                res.status(200);
                res.json({
                    status: "success",
                    message: `${rows.length} records retrieved`,
                    result: rows,
                });
            } else {
                res.status(401);
                res.json({
                  status: "success",
                  message: `Invalid user credentials - user not found.`,
                });
              }
            }
          });
        };

//tested and working in postman
exports.postRegisterUser = (req, res) => {
    const { username, password, firstname, lastname, email } = req.body;
    const vals = [username, password, firstname, lastname, email];
    
    const insertUserSQL =
        "INSERT INTO user_details (username, user_password, first_name, last_name, email_address) VALUES (?, ?, ?, ?, ?)";

        conn.query(insertUserSQL, vals, (err, rows) => {
            if (err) {
              res.status(500);
              res.json({
                status: "failure",
                message: err,
              });
            } else {
              res.status(201);
              res.json({
                status: "success",
                message: `Record ID ${rows.insertId} added`,
              });
            }
          });
        };

