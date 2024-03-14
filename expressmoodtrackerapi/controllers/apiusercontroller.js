const conn = require('./../util/dbconn');

exports.postLogin = (req, res) => {
    const { username, userpass } = req.body;
    const vals = [username, userpass];
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
                  status: "failure",
                  message: `Invalid user credentials - user not found.`,
                });
              }
            }
          });
        };