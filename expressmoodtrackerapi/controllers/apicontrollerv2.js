const conn = require("./../util/dbconn");



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
        res.status(204);
        res.json({
          status: "success",
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
          res.status(500).json({
              status: "failure",
              message: err,
          });
      } else {
          if (rows.length === 0) {
              // If no snapshot is found with the provided snapshot ID and user ID
              res.status(401).json({
                  status: "failure",
                  message: `Snapshot id ${id} is not valid for user ID ${user_ID}`,
              });
          } else {
              // If a snapshot is found, proceed to fetch its triggers
              conn.query(selectChosenTriggersSQL, [id], (triggerErr, triggers) => {
                  if (triggerErr) {
                      res.status(500).json({
                          status: "failure",
                          message: triggerErr,
                      });
                  } else {
                      res.status(200).json({
                          status: "success",
                          message: `Snapshot id ${id}, returned with ${triggers.length} triggers`,
                          result: rows,
                          triggers: triggers
                      });
                  }
              });
          }
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

//working
exports.getEditSingleSnapshotv2 = (req, res) => {
    const { id, user_ID } = req.params;
    const selectUserSnapshotsSQL = `SELECT * FROM snapshot WHERE snapshot_id = ? AND user_id = ?`;
    const selectChosenTriggersSQL = `
                                    SELECT t.trigger_name 
                                    FROM snapshot_trigger st 
                                    JOIN \`trigger\` t ON st.trigger_ID = t.trigger_ID 
                                    WHERE st.snapshot_ID = ?`;
    const selectTriggersSQL = "SELECT * FROM `trigger` ORDER BY trigger_name ASC";
                                    
    conn.query(selectUserSnapshotsSQL, [id, user_ID], (err, snapshot) => {
        if (err) {
            res.status(500);
            res.json({
                status: "failure",
                message: err,
            });
        } else if (snapshot.length > 0) { // Corrected from 'rows' to 'snapshot'
            conn.query(selectChosenTriggersSQL, [id], (triggerErr, selectedTriggers) => {
                if (triggerErr) {
                    res.status(500);
                    res.json({
                        status: "failure",
                        message: triggerErr,
                    });
                } else {
                    conn.query(selectTriggersSQL, (triggerErr, triggers) => { // Removed [id] as parameter
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
                                message: `Snapshot id ${id}, returned with ${selectedTriggers.length} triggers`, // Changed 'chosenTriggers' to 'selectedTriggers'
                                snapshot: snapshot,
                                triggers: triggers,
                                selectedTriggers: selectedTriggers
                            });
                        }
                    });
                }
            });
        } else {
            res.status(404);
            res.json({
                status: "failure",
                message: `No snapshot found with id ${id}`,
            });
        }
    });
};


exports.postAddSnapshot = (req, res) => {    
  const vals = { snapshot, selectedTriggers } = req.body;
  const insertSnapshotSQL = `INSERT INTO snapshot (enjoyment_level, surprise_level, contempt_level, sadness_level, fear_level, disgust_level, anger_level, user_id, timestamp, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const identifyTriggerSQL = "SELECT trigger_ID FROM `trigger` WHERE trigger_name IN (?)";    
  const insertSnapshotTriggerSQL = `INSERT INTO snapshot_trigger (snapshot_ID, trigger_ID) VALUES (?, ?)`;
  // Start a transaction
  conn.beginTransaction(err => {
      if (err) {
          res.status(500).json({ error: 'Failed to start transaction' });
          return;
      }    
      // Execute SQL queries within the transaction
      conn.query(insertSnapshotSQL, [snapshot.enjoyment_level, snapshot.surprise_level, snapshot.contempt_level, snapshot.sadness_level, snapshot.fear_level, snapshot.disgust_level, snapshot.anger_level, snapshot.user_id, snapshot.timestamp, snapshot.notes], (err, snapshotResult) => {
          if (err) {
              return conn.rollback(() => {
                  res.status(500).json({ error: 'Error inserting snapshot', message: err.message });
              });
          }
          const snapshot_ID = snapshotResult.insertId;
          console.log(snapshot_ID)
          conn.query(identifyTriggerSQL, [selectedTriggers], (err, triggerResults) => {
              if (err) {
                  return conn.rollback(() => {
                      res.status(500).json({ error: 'Error searching for trigger names', message: err.message });
                  });
              }
              console.log(triggerResults) 
             
                  triggerResults.forEach((row) => {
                      conn.query(
                          insertSnapshotTriggerSQL,
                          [snapshot_ID, row.trigger_ID],
                          (err, result) => {
                              // If all queries executed successfully, commit the transaction
                              
                          });
                          
                        });
                        conn.commit(err => {
                          if (err) {
                              return conn.rollback(() => {
                                  res.status(500).json({ error: 'Error committing transaction', message: err.message });
                              });
                          }                
                          // Transaction successfully committed
                          res.status(200).json({ message: 'Transaction successfully completed', snapshot_ID });
                  });
              });
          });
      });
 
};


//DON't go above here//// ALLL CODE ABOVE HERE WORKS!

exports.postDeleteSnapshot = (req, res) => {
  const { id, user_ID } = req.params;
  
  const deleteSnapshotTriggersSQL = `DELETE  FROM snapshot_trigger WHERE snapshot_id = ?`;
  const deleteSnapshotSQL = `DELETE FROM snapshot WHERE snapshot_ID = ? AND user_ID = ?`;

  conn.query(deleteSnapshotTriggersSQL, [id], (err, rows) => {
    if (err) {
      res.status(500);
      res.json({
        status: "failure",
        message: err,
      });
    } else {
      conn.query(deleteSnapshotSQL, [id, user_ID], (err, rows) => { 
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
            message: `Snapshot id ${id}, deleted`, 
          });
        }
      });
    }
  });
};