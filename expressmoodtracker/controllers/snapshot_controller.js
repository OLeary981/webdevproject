const conn = require("./../util/dbconn");
const pool = require("./../util/dbconn");



// Website page and snapshot page controllers

exports.getIndex = (req, res) => { 
  const {error} = req.query;
      res.render("index", { error });    
};

exports.getAbout = (req,res) => {
 res.render("about") ;
}

exports.getAddSnapshot = (req, res) => {
  //const { user_ID, first_name } = req.session;
  const { message } = req.query;
  const welcomeMessage = message || `How are you feeling?`;
  conn.query("SELECT * FROM `trigger` ORDER BY trigger_name ASC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching triggers");
    }    
    res.render("addsnapshotcheckboxes", { triggers: rows, currentPage: "/newsnapshot", message: welcomeMessage });
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
  const { user_ID, first_name } = req.session;
  const vals = user_ID;

  const selectSnapshotsSQL = `SELECT * FROM snapshot WHERE user_id = ? ORDER BY timestamp`;

  conn.query(selectSnapshotsSQL, vals, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal server error');
      return;
    }
    console.log("About to render allSnapshots")
    console.log(results)
    console.log(req.session.first_name);
//If the user has no snapshots to display, then direct them to the addSnapshot instead
    if (results.length === 0) {
      const welcomeMessage = `Welcome to mood tracker ${first_name}! Add the first snapshot of your emotions to get started!`;
      return res.redirect(`/newsnapshot?message=${encodeURIComponent(welcomeMessage)}`);
    }

    res.render('overview', {
      snapshots: results,
      currentPage: '/allsnapshots',
      session: req.session // Assuming you have a way to determine if the user is logged in
    });
  });
};



exports.getLanding = (req, res) => {
  const { isLoggedIn } = req.session; //use this later to redirect to home page if already logged in?
  res.render("landing", { currentPage: "/landing", isLoggedIn, error: null });
};

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
  console.log("In the line before the formTriggers extraction")

  const formTriggers = req.body.triggers || []; 
  console.log(formTriggers);
  let selectedTriggers;
  if (formTriggers.length === 0) {
      // Handle the case where no triggers are selected
      console.log("No triggers selected.");
      selectedTriggers = null; //putting const infront here causes an error. goodness knows why.
      console.log(`Selected Triggers array should be null: ${selectedTriggers}`);     
  } else {
      const formTriggersSeparated = formTriggers.flatMap(item => item.split(','));
      const filteredTriggers = formTriggersSeparated.filter(item => item !== 'on');
      selectedTriggers = filteredTriggers
      console.log(selectedTriggers);
      // Proceed with processing selected triggers
  }

  
   const { user_ID } = req.session;
   console.log("Line 524");
  console.log(selectedTriggers);
  
  
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
