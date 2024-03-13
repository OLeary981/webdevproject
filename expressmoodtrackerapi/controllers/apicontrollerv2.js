const conn = require("./../util/dbconn");

//GET /favourites
exports.getFavourites = (req, res) => {
  const selectFavouritesSQL = "SELECT * FROM favourites";

  conn.query(selectFavouritesSQL, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      res.status(200);
      res.json({
        status: "success",
        message: `${rows.length} records returned from here`,
        result: rows,
      });
    }
  });
};

// GET /snapshots
exports.getTriggers = (req, res) => {
  const selectTriggersSQL = "SELECT * FROM `trigger` ORDER BY trigger_name ASC";

  conn.query(selectTriggersSQL, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      res.status(200);
      res.json({
        status: "success",
        message: `${rows.length} records returned from inside the getSnapshots controller v2`,
        result: rows,
      });
    }
  });
};

exports.getUserSnapshots = (req, res) => {
  const { id } = req.params;
  const selectUserSnapshotsSQL = `SELECT * FROM snapshot WHERE user_id = ${id} ORDER BY timestamp`;
  conn.query(selectUserSnapshotsSQL, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        //message: err,
      });
    } else {
      if (rows.length > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `${rows.length} results recieved for user_ID ${id} retrieved using api`,
          result: rows,
        });
      } else {
        res.status(404);
        res.json({
          status: "failure",
          message: `No snapshot records found for user_id :${id}`,
        });
      }
    }
  });
};


exports.getSingleSnapshot = (req, res) => {
        const { id, user_ID } = req.params;
        const selectUserSnapshotsSQL = `SELECT * FROM snapshot WHERE snapshot_id = ? AND user_id = ?`;
        const selectChosenTriggersSQL = `
                                        SELECT t.trigger_name 
                                        FROM snapshot_trigger st 
                                        JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID 
                                        WHERE st.snapshot_ID = ?`;
        conn.query(selectUserSnapshotsSQL, [id, user_ID], (err, rows) => {
          if (err) {
            res.status(500);
            res.json({
              status: "failure",
              message: err,
            });
          } else if (rows.length > 0) {
            conn.query(selectChosenTriggersSQL, [id], (triggerErr, triggers) => {
              if (triggerErr) {
                res.status(500);
                res.json({
                  status: "failure",
                  message: triggerErr,
                });
              } else {
                res.status(200);
                res.json({
                  status: "success",
                  message: `Snapshot id ${id}, returned with ${triggers.length} triggers`,
                  result: rows,
                  triggers: triggers
                });
              }
            });
          }
        });
      };
    
                
              

exports.getChosenTriggers = (req, res) => {
  const { id } = req.params;
  const selectChosenTriggersSQL = `SELECT t.trigger_name FROM snapshot_trigger st JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID WHERE st.snapshot_ID = ${id}`;
  conn.query(selectChosenTriggersSQL, (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      if (rows.length > 0) {
        res.status(200);
        res.json({
          status: "success",
          message: `${rows.length} results recieved for snapshot_id: ${id} retrieved using api`,
          result: rows,
        });
      } else {
        res.status(200);
        res.json({
          status: "success",
          message: `No snapshot records found for snapshot_id :${id}`,
        });
      }
    }
  });
};

exports.getEditSnapshot = (req, res) => {

  const selectAllTriggersSQL =
    "SELECT * FROM `trigger` ORDER BY trigger_name ASC";
  const selectChosenTriggersSQL =
    "SELECT t.trigger_name FROM snapshot_trigger st JOIN `trigger` t ON st.trigger_ID = t.trigger_ID WHERE st.snapshot_ID = ?";
  const selectSnapshotSQL = "SELECT * FROM snapshot WHERE snapshot_ID = ? and user_id = ?";

  // Define your endpoint function
  function runQueries(req, res) {
    // Run the first query to select all triggers
    connection.query(selectAllTriggersSQL, (err, allTriggers) => {
      if (err) {
        console.error("Error executing first query:", err);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Run the second query to select chosen triggers
      connection.query(
        selectChosenTriggersSQL,
        [req.params.snapshotId],
        (err, chosenTriggers) => {
          if (err) {
            console.error("Error executing second query:", err);
            res.status(500).send("Internal Server Error");
            return;
          }

          // Run the third query to select snapshot details
          connection.query(
            selectSnapshotSQL,
            [req.params.snapshotId],
            (err, snapshotDetails) => {
              if (err) {
                console.error("Error executing third query:", err);
                res.status(500).send("Internal Server Error");
                return;
              }

              // Send the results back to the client with status 200
              res.status(200).json({
                allTriggers: allTriggers,
                chosenTriggers: chosenTriggers,
                snapshotDetails: snapshotDetails,
              });
            }
          );
        }
      );
    });
  }
};
