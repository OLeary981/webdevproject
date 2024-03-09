const conn = require("./../util/dbconn");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");

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

  const selectSQL = "SELECT * FROM favourites";

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
        if (fav === "Meat") {
          countmeat++;
        } else if (fav === "Fish") {
          countfish++;
        } else if (fav === "Vegetables") {
          countveg++;
        } else if (fav === "Desert") {
          countdesert++;
        }
      });

      const vals = [countmeat, countfish, countveg, countdesert];

      res.render("index", { currentPage: "/", result: rows, vals, isLoggedIn });
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

  const selectSQL = "SELECT * FROM favourites";

  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      res.render("editfavourites", {
        currentPage: "/editfav",
        result: rows,
        isLoggedIn,
      });
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
      res.render("editsinglefavourite", { result: rows, isLoggedIn });
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
      res.render("deletesinglefavourite", { result: rows, isLoggedIn });
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

  res.render("addfavourite", { currentPage: "/newfav", isLoggedIn });
};

exports.postInsertFavourite = (req, res) => {
  const data = req.body;
  console.log(data);

  const { myname, myfoodtype } = req.body;
  const vals = [myname, myfoodtype];

  const insertSQL = "INSERT INTO favourites (person, favourite) VALUES (?, ?)";

  conn.query(insertSQL, vals, (err, rows) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/");
    }
  });
};

exports.postUpdateFavourite = (req, res) => {
  console.log(req.params);
  console.log(req.body);

  const { id } = req.params;
  const { myname, myfoodtype } = req.body;
  const vals = [myfoodtype];

  const updateSQL = `UPDATE favourites SET favourite = ? WHERE id = ${id}`;
  conn.query(updateSQL, vals, (err, rows) => {
    if (err) throw err;

    res.redirect("/editfav");
  });
};

exports.postDeleteFavourite = (req, res) => {
  const { id } = req.params;

  const deleteSQL = `DELETE FROM favourites WHERE id = ${id}`;
  conn.query(deleteSQL, (err, rows) => {
    if (err) throw err;

    res.redirect("/editfav");
  });
};

/////////////////////////////////////////
// New methods

exports.getRegisterUser = (req, res) => {
    const {error} = req.query;
  res.render("register", { error }); //add protection etc so can only register if not logged in?
};

exports.getLogin = (req, res) => {
  const { isLoggedIn } = req.session;
  const {error} = req.query;
  res.render("login", { currentPage: "/login", isLoggedIn, error});
};

exports.getAddSnapshot = (req, res) => {
  const { isLoggedIn } = req.session;
  conn.query("SELECT * FROM `trigger`", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching triggers");
    }
    res.render("addsnapshot", { triggers: rows, currentPage: "/newsnapshot" });
  });
};



exports.getSingleSnapshot = async (req, res) => {
  const { id } = req.params;
  const {user_ID} = req.session
  const selectSQL = `SELECT * FROM snapshot WHERE snapshot_id = ${id} AND user_ID = ${user_ID}`;
  conn.query(selectSQL, (err, rows) => {
    if (err) {
      throw err;
    } else {
      if (rows.length >0){
        console.log(rows);
      res.render("singlesnapshot", { result: rows});
      } else {
        res.render('404');
      }
      
    }
  });
}

exports.getAllSnapshots = async (req, res) => {
  const { user_ID, isLoggedIn } = req.session;
  const vals = user_ID;

  try {
    const dates = await queryDatabase(
      `SELECT timestamp FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
      vals
    );
    const levels = await Promise.all([
      queryDatabase(
        `SELECT enjoyment_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
      queryDatabase(
        `SELECT surprise_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
      queryDatabase(
        `SELECT contempt_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
      queryDatabase(
        `SELECT sadness_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
      queryDatabase(
        `SELECT fear_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
      queryDatabase(
        `SELECT disgust_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
      queryDatabase(
        `SELECT anger_level FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
        vals
      ),
    ]);

    const snapshots = await queryDatabase(
      `SELECT * FROM snapshot WHERE user_id = ? ORDER BY timestamp`,
      vals
    );
    console.log(snapshots);

    res.render("graphwithfilters", {
      dates,
      levels,
      snapshots,
      currentPage: "/allsnapshots",
      isLoggedIn,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
};

const queryDatabase = (sql, params) => {
  return new Promise((resolve, reject) => {
    conn.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getLanding = (req, res) => {
  const { isLoggedIn } = req.session; //use this later to redirect to home page if already logged in?
  res.render("landing", { currentPage: "/landing", isLoggedIn, error: null });
};

exports.postLogin = (req, res) => {
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("login", { error: errors.array()[0].msg });
  }

  const { username, userpass } = req.body;
  const vals = [username, userpass];
  console.log(`postLogin vals: ${vals}`);

  /*
    const checkuserSQL = `SELECT * FROM favourites_users WHERE favourites_users.username = '${ username }' 
                            AND favourites_users.password = '${ userpass }'`;
    */

  const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? 
                            AND user_details.user_password = ?`;

  conn.query(checkuserSQL, vals, (err, rows) => {
    if (err) throw err;

    if (rows.length > 0) {
      const session = req.session;
      session.isLoggedIn = true;
      console.log(`postLogin: session: ${session}`);

      var orig_route = session.route;
      console.log(`postLogin: orig_route: ${orig_route}`);

      if (!orig_route) {
        orig_route = "/";
      }
      res.redirect(`${orig_route}`);

      //res.redirect('/');
    } else {
      res.redirect("/");
    }
  });
};

exports.postLoginBcrypt = (req, res) => {
  const { isLoggedIn } = req.session;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("login", { error: errors.array()[0].msg });
  }

  const { username, userpass } = req.body;
  const vals = [username, userpass];
  console.log(`postLogin vals: ${vals}`);

  /*
    const checkuserSQL = `SELECT * FROM favourites_users WHERE favourites_users.username = '${ username }' 
                            AND favourites_users.password = '${ userpass }'`;
    */

  const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? `;

  conn.query(checkuserSQL, vals, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking username"); //consider changing this to something more graceful
    }

    if (rows.length === 0) {
      return res.redirect("/login?error=User not found");
    }

    const hashedPassword = rows[0].user_password;

    bcrypt.compare(userpass, hashedPassword, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error comparing passwords");
      }

      if (result) {
        const session = req.session;
        session.isLoggedIn = true;
        session.user_ID = rows[0].user_ID;
        console.log(`postLogin: session: ${session}`);
        console.log(`user number: ${session.user_ID}`);

        var orig_route = session.route;
        console.log(`postLogin: orig_route: ${orig_route}`);
        if (!orig_route) {
          orig_route = "/allsnapshots";
        }
        return res.redirect(orig_route);
      } else {
        return res.render("login", {
          currentPage: "/login",
          error: "Incorrect password",
          isLoggedIn,
        });
      }
    });
  });
};

exports.postRegisterUser = async (req, res) => {
  const { username, password } = req.body;
  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("register", { error: errors.array()[0].msg });
  }

  try {
    // Check if the username already exists in the database
    const checkUserQuery = "SELECT * FROM user_details WHERE username = ?";
    conn.query(checkUserQuery, [username], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error checking username");
      }

      if (rows.length > 0) {
        // Username already exists
        return res.redirect(
            "/register?error=Username taken choose another or login</a>"
        );
      }

      // Hash password
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error hashing password");
        }

        // Insert user into database
        const insertSQL =
          "INSERT INTO user_details (username, user_password) VALUES (?, ?)";
        conn.query(insertSQL, [username, hash], (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).send("Error registering user");
          }
          res.redirect("/login");
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error registering user");
  }
};
//commenting out but this one works, just playing around with enhancements.
// exports.postRegisterUser = (req, res) => {
//   const { username, password } = req.body;
//   console.log(username);
//   console.log(password);

//   // Hash password
//   bcrypt.hash(password, 10, (err, hash) => {
//     if (err) {
//       console.error(err);
//       res.status(500).send("Error hashing password");
//       return;
//     }
//     const insertSQL =
//       "INSERT INTO user_details (username, user_password) VALUES (?, ?)";
//     // Insert user into database - NEED TO ADD CHECK THAT THE USER IS NOT ALREADY REGISTERED?
//     const newUser = { username, password: hash };
//     conn.query(
//       insertSQL,
//       [newUser.username, newUser.password],
//       (error, rows) => {
//         if (error) {
//           console.error(error);
//           res.status(500).send("Error registering user");
//           return;
//         }
//         res.redirect("/login");
//       }
//     );
//   });
// };
// VERY MUCH UNFINISHED
exports.postAddSnapshot = (req, res) => {
  // Extract slider levels and notes from request body
  console.log(req.body);

  const {
    enjoyment,
    surprise,
    contempt,
    sadness,
    fear,
    disgust,
    anger,
    notes,
  } = req.body;
  const formTriggers = req.body.triggers;
  console.log(formTriggers);
  const selectedTriggers = formTriggers.split(',');
  const { user_ID } = req.session;
  console.log(selectedTriggers);
  //const selectedTriggers = ["Work", "Commute"]
  const notesValue = notes ? notes : null;
  console.log([
    enjoyment,
    surprise,
    contempt,
    sadness,
    fear,
    disgust,
    anger,
    user_ID,
    notesValue,
  ]);
  console.log(selectedTriggers);

  // Start a transaction
  conn.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).send("Error beginning transaction");
    }

    // Insert snapshot data into the snapshot table
    const insertSnapshotSQL = `INSERT INTO snapshot (enjoyment_level, surprise_level, contempt_level, sadness_level, fear_level, disgust_level, anger_level, user_id, timestamp, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`;
    // Assuming user_ID is available from session
    conn.query(
      insertSnapshotSQL,
      [
        enjoyment,
        surprise,
        contempt,
        sadness,
        fear,
        disgust,
        anger,
        user_ID,
        notesValue,
      ],
      (err, result) => {
        if (err) {
          console.error("Error inserting data into snapshot table:", err);
          return conn.rollback(() => {
            res.status(500).send("Error inserting data into snapshot table");
          });
        }

        // Get the auto-incremented snapshot_ID - do I need to add 1 to this because of the transaction?
        const snapshotID = result.insertId;

        // Retrieve trigger IDs for selected triggers
        conn.query(
          "SELECT trigger_ID FROM `trigger` WHERE trigger_name IN (?)",
          [selectedTriggers],
          (err, triggerResults) => {
            console.log(`trigger results are: ${triggerResults}`);
            if (err) {
              console.error("Error retrieving trigger IDs:", err);
              return conn.rollback(() => {
                res.status(500).send("Error retrieving trigger IDs");
              });
            }

            // Insert snapshot-trigger associations into the snapshot_trigger table
            const insertSnapshotTriggerSQL = `INSERT INTO snapshot_trigger (snapshot_ID, trigger_ID) VALUES (?, ?)`;
            triggerResults.forEach((row) => {
              conn.query(
                insertSnapshotTriggerSQL,
                [snapshotID, row.trigger_ID],
                (err, result) => {
                  if (err) {
                    console.error(
                      "Error inserting data into snapshot_trigger table:",
                      err
                    );
                    conn.rollback(() => {
                      res
                        .status(500)
                        .send(
                          "Error inserting data into snapshot_trigger table"
                        );
                    });
                  }
                }
              );
            });

            // Commit the transaction
            conn.commit((err) => {
              if (err) {
                console.error("Error committing transaction:", err);
                return conn.rollback(() => {
                  res.status(500).send("Error committing transaction");
                });
              }
              console.log("Transaction successfully committed");
              // Redirect to index or any other page after successful transaction
              res.redirect("/");
            });
          }
        );
      }
    );
  });
};
