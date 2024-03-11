exports.getAllSnapshotsModified = async (req, res) => {
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