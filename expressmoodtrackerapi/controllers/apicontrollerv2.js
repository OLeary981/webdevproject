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
exports.getSnapshots = (req, res) => {
  const selectSnapshotSQL = "SELECT * FROM snapshot";

  conn.query(selectSnapshotSQL, (err, rows) => {
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

      