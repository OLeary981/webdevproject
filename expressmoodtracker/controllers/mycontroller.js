const conn = require("./../util/dbconn");
const pool = require("./../util/dbconn");
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

exports.getIndex = (req, res) => { 
  const {error} = req.query;
      res.render("index", { error });    
};

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
  conn.query("SELECT * FROM `trigger` ORDER BY trigger_name ASC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching triggers");
    }
    res.render("addsnapshotcheckboxes", { triggers: rows, currentPage: "/newsnapshot" });
  });
};

exports.getEditSnapshot = (req, res) => {
  const { id } = req.params;
  const selectAllTriggersSQL = "SELECT * FROM `trigger` ORDER BY trigger_name ASC";
  const selectChosenTriggersSQL = `SELECT t.trigger_name FROM snapshot_trigger st JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID WHERE st.snapshot_ID = ${id}`;
  const selectSnapshotSQL = `SELECT snapshot_ID, enjoyment_level, surprise_level, contempt_level, sadness_level, fear_level, disgust_level, anger_level, timestamp FROM snapshot WHERE snapshot_ID = ${id}`;

  conn.query(selectSnapshotSQL, (err, snapshot) => {
      if (err) {
          console.error("Error fetching snapshot:", err);
          return res.render('404', { error: err });
      }

      conn.query(selectAllTriggersSQL, (err, triggers) => {
          if (err) {
              console.error("Error fetching triggers:", err);
              return res.render('404', { error: err });
          }

          conn.query(selectChosenTriggersSQL, (err, selectedTriggers) => {
              if (err) {
                  console.error("Error fetching selected triggers:", err);
                  return res.render('404', { error: err });
              }
console.log(snapshot);
console.log(triggers);
console.log(selectedTriggers);
              res.render("editsnapshotcheckboxes", { snapshot, triggers, selectedTriggers });
          });
      });
  });
};

//overly complicated.
// exports.getEditSnapshot = async (req, res) => {
//   const { id } = req.params;
//   const selectAllTriggersSQL = "SELECT * FROM `trigger` ORDER BY trigger_name ASC";
//   const selectChosenTriggersSQL = `SELECT t.trigger_name FROM snapshot_trigger st  JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID WHERE st.snapshot_ID = ${id};`
//   const selectSnapshotSQL = `SELECT enjoyment_level, surprise_level, contempt_level, sadness_level, fear_level, disgust_level, anger_level, timestamp FROM snapshot WHERE snapshot_ID = ${id};`

//   const getSnapshot = () => {
//     return new Promise((resolve, reject) => {
//         conn.query(selectSnapshotSQL, (err, snapshot) => {
//             if (err) {
//                 reject(err);
//             } else {
//               console.log(snapshot);
//                 resolve(snapshot);
//             }
//         });
//     });
// };

// const getTriggers = () => {
//     return new Promise((resolve, reject) => {
//         conn.query(selectAllTriggersSQL, (err, triggers) => {
//             if (err) {
//                 reject(err);
//             } else {
//               console.log(triggers);
//                 resolve(triggers);
//             }
//         });
//     });
// };

// const getSelectedTriggers = () => {
//     return new Promise((resolve, reject) => {
//         conn.query(selectChosenTriggersSQL, (err, selectedTriggers) => {
//             if (err) {
//                 reject(err);
//             } else {
//               console.log(selectedTriggers);
//                 resolve(selectedTriggers);
//             }
//         });
//     });
// };


//   try {
//       const snapshot = await getSnapshot();
//       const triggers = await getTriggers();
//       const selectedTriggers = await getSelectedTriggers();

//       // Pass the data to your rendering function
//       res.render("editsnapshotcheckboxes", { snapshot, triggers, selectedTriggers });
//   } catch (error) {
//       console.error("Error:", error);
//       res.render('404', { error });
//   }

  
// }


//OLD VERSION - WORKS BUT NOW ADDING TRIGGERS TO IT ALSO
// exports.getSingleSnapshot = async (req, res) => {
//   const { id } = req.params;
//   const {user_ID} = req.session
//   const selectSQL = `SELECT * FROM snapshot WHERE snapshot_id = ${id} AND user_ID = ${user_ID}`;
//   conn.query(selectSQL, (err, rows) => {
//     if (err) {
//       throw err;
//     } else {
//       if (rows.length >0){
//         console.log(rows);
//       res.render("singlesnapshot", { result: rows});
//       } else {
//         res.render('404');
//       }
      
//     }
//   });
// }

exports.getSingleSnapshot = async (req, res) => {
  const { id } = req.params;
  const { user_ID } = req.session;

  // Query to fetch snapshot details
  const selectSnapshotSQL = `SELECT * FROM snapshot WHERE snapshot_id = ? AND user_ID = ?`;

  // Query to fetch chosen triggers
  const selectChosenTriggersSQL = `
    SELECT t.trigger_name 
    FROM snapshot_trigger st 
    JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID 
    WHERE st.snapshot_ID = ?`;

  // Execute the queries
  conn.query(selectSnapshotSQL, [id, user_ID], (err, rows) => {
    if (err) {
      console.error("Error fetching snapshot:", err);
      return res.render('404', { error: err });
    }

    if (rows.length > 0) {
      // If snapshot found, execute trigger query
      conn.query(selectChosenTriggersSQL, [id], (triggerErr, triggers) => {
        if (triggerErr) {
          console.error("Error fetching triggers:", triggerErr);
          return res.render('404', { error: triggerErr });
        }

        // Render the singlesnapshot page with snapshot and triggers
        res.render("singlesnapshot", { result: rows, triggers });
      });
    } else {
      // If snapshot not found, render 404 page
      res.render('404');
    }
  });
};


exports.getAllSnapshotsSimplified = (req, res) => {
  const { user_ID } = req.session;
  const vals = user_ID;

  const selectSnapshotsSQL = `SELECT * FROM snapshot WHERE user_id = ? ORDER BY timestamp`;

  conn.query(selectSnapshotsSQL, vals, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    //console.log(results)

    res.render('newOverviewSimpleController', {
      snapshots: results,
      currentPage: '/allsnapshots',
      session: req.session // Assuming you have a way to determine if the user is logged in
    });
  });
};

//can this be deleted? model used for other queries?
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
        session.first_name = rows[0].first_name;
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
            "/register?error=Username taken choose another or <a>/login</a>"
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

  const formTriggers = req.body.triggers ? req.body.triggers.split(',') : []; // Convert string to array using comma as delimiter or set it as an empty array if triggers are not provided
  console.log(formTriggers);
  let selectedTriggers;
  if (formTriggers.length === 0) {
      // Handle the case where no triggers are selected
      console.log("No triggers selected.");
      selectedTriggers = null; //putting const infront here causes an error. goodness knows why.
      console.log(`Selected Triggers array should be null: ${selectedTriggers}`);     
  } else {
      const filteredTriggers = formTriggers.filter(item => item !== 'on');
      selectedTriggers = filteredTriggers
      console.log(selectedTriggers);
      // Proceed with processing selected triggers
  }

  // const formTriggers = req.body.triggers;
  // console.log(formTriggers);
  // const filteredTriggers = formTriggers.filter(item => item !== 'on');
  // const selectedTriggers = filteredTriggers.flatMap(element => element.split(',')); //to make the array of triggers that can be used by SQL statement
   const { user_ID } = req.session;
   console.log("Line 524");
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
  console.log("line 540")
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
        const snapshot_ID = result.insertId;

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
                [snapshot_ID, row.trigger_ID],
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
              res.redirect(`/singlesnapshot/${snapshot_ID}`);
            });
          }
        );
      }
    );
  });
};



exports.postEditSnapshot = (req, res) => {
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

  const filteredTriggers = formTriggers.filter(item => item !== 'on');
  const selectedTriggers = filteredTriggers.flatMap(element => element.split(',')); //to make the array of triggers that can be used by SQL statement

  const { user_ID } = req.session;
  const { id: snapshot_ID } = req.params;
  const params = [
    enjoyment,
    surprise,
    contempt,
    sadness,
    fear,
    disgust,
    anger,    
    notes,
    snapshot_ID,
    user_ID
  ];
  
  console.log("Line 524");
  console.log(selectedTriggers);
  console.log(params);
  console.log("line 540");
  console.log(selectedTriggers);

  // Start a transaction
  conn.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      return res.status(500).send("Error beginning transaction");
    }

    // Insert snapshot data into the snapshot table
    const updateSnapshotSQL = `UPDATE snapshot SET enjoyment_level=?, surprise_level=?, contempt_level=?, sadness_level=?, fear_level=?, disgust_level=?, anger_level=?, notes=? WHERE snapshot_ID=? AND user_id=?`;

    conn.query(
      updateSnapshotSQL,
      params,
      (err, result) => {
        if (err) {
          console.error("Error inserting data into snapshot table:", err);
          return conn.rollback(() => {
            res.status(500).send("Error inserting data into snapshot table");
          });
        }

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

            // Delete existing snapshot-trigger associations from the snapshot_trigger table
            const deleteSnapshotTriggerSQL = `DELETE FROM snapshot_trigger WHERE snapshot_ID = ?`;

            conn.query(deleteSnapshotTriggerSQL, [snapshot_ID], (deleteErr, deleteResult) => {
              if (deleteErr) {
                console.error("Error deleting data from snapshot_trigger table:", deleteErr);
                conn.rollback(() => {
                  res.status(500).send("Error deleting data from snapshot_trigger table");
                });
                return;
              }

              // Insert new snapshot-trigger associations into the snapshot_trigger table
              const insertSnapshotTriggerSQL = `INSERT INTO snapshot_trigger (snapshot_ID, trigger_ID) VALUES (?, ?)`;
              triggerResults.forEach((row) => {
                conn.query(insertSnapshotTriggerSQL, [snapshot_ID, row.trigger_ID], (insertErr, insertResult) => {
                  if (insertErr) {
                    console.error("Error inserting data into snapshot_trigger table:", insertErr);
                    conn.rollback(() => {
                      res.status(500).send("Error inserting data into snapshot_trigger table");
                    });
                  }
                });
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
                res.redirect(`/singlesnapshot/${snapshot_ID}`);
              });
            });
          }
        );
      }
    );
  });
};


exports.postDeleteSnapshot = (req, res) => { 

  const { id: snapshot_ID } = req.params;
  const { user_ID } = req.session;
  const deleteSnapshotSQL = `DELETE FROM snapshot WHERE snapshot_ID = ? AND user_ID = ?`;

  conn.query(deleteSnapshotSQL, [snapshot_ID, user_ID], (err, rows) => {
    if (err) {
      throw err;
    } else {
      console.log(rows);
      res.redirect("/allsnapshots");
    }
  });
};
