const conn = require("./../util/dbconn");
const axios = require('axios');



// Website page and snapshot page controllers

exports.getIndex = (req, res) => { 
  const {error} = req.query;
      res.render("index", { error });    
};

exports.get500 = (req, res) => { 
  const {error} = req.query;
      res.render("500", { errorMessage: errorMessage  });    
};

exports.getAbout = (req,res) => {
 res.render("about") ;
}

//has an API
exports.getAddSnapshot = async (req, res) => {
  //const { user_ID, first_name } = req.session;
  const { message } = req.query;
  const welcomeMessage = message || `How are you feeling?`;
  const endpoint = `http://localhost:3002/triggers`;
  await axios
  .get(endpoint)
  .then((response) => {
    console.log("made it back from the axios endpoint")  
    const results = response.data.result
    console.log(results)
    console.log(req.session.first_name);
  //If the user has no snapshots to display, then direct them to the addSnapshot instead
    if (results.length === 0) {
      const welcomeMessage = `Welcome to mood tracker ${first_name}! Add the first snapshot of your emotions to get started!`;
      return res.redirect(`/newsnapshot?message=${encodeURIComponent(welcomeMessage)}`);
    }
    res.render("addsnapshotcheckboxes", { triggers: results, currentPage: "/newsnapshot", message: welcomeMessage });
  })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
      });
  
  };
 //has an API
  exports.getSingleSnapshot = async (req, res) => {
    const { id } = req.params;
    const { user_ID } = req.session;  
    const endpoint = `http://localhost:3002/singlesnapshot/${id}/${user_ID}`;
    
    await axios.get(endpoint)
      .then((response) => {
        console.log("made it back from the axios endpoint");  
        const results = response.data.result;
        const triggers = response.data.triggers;
        console.log(results);
        console.log(req.session.first_name);   
        res.render("singlesnapshot", { result: results, triggers: triggers }); // Fix 'rows' to 'results'
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Handle 401 Unauthorized error
          console.log("Unauthorized access to snapshot");
          res.status(401).render('500', { errorMessage: "Unauthorized access to snapshot" });
      } else {
          // Handle other errors
          console.log(`Error making API request: ${error}`);
          res.status(500).send("An error occurred. Please try again later.");
          res.render('404');
      }
      });
  };

  //has an API 
exports.getAllSnapshotsSimplified = async (req, res) => {
  const { user_ID, first_name } = req.session;
  const vals = user_ID;

  const endpoint = `http://localhost:3002/snapshots/${vals}`;
  await axios
  .get(endpoint)
  .then((response) => {
    console.log("made it back from the axios endpoint")  
    const results = response.data.result
    console.log(results)
    console.log(req.session.first_name);
//If the user has no snapshots to display, then direct them to the addSnapshot instead
    if (response.status === 204) {
      const welcomeMessage = `Welcome to mood tracker ${first_name}! Add the first snapshot of your emotions to get started!`;
      return res.redirect(`/newsnapshot?message=${encodeURIComponent(welcomeMessage)}`);
    }
    res.render('overview', {
      snapshots: results,
      currentPage: '/allsnapshots',
      session: req.session // Assuming you have a way to determine if the user is logged in
    })
  })
    .catch((error) => {
      console.log(`Error making API request: ${error}`);
      res.status(500).send("An error occurred. Please try again later.");
      });
  
};

//has an API
exports.getEditSnapshot = async (req, res) => {
  const { id } = req.params;
  const { user_ID } = req.session;  
  const endpoint = `http://localhost:3002/editsinglesnapshot/${id}/${user_ID}`;
  await axios.get(endpoint)
  .then((response) => {
    console.log("made it back from the axios endpoint");  
    const snapshot = response.data.snapshot;
    const triggers = response.data.triggers;
    const selectedTriggers = response.data.selectedTriggers;
    console.log(snapshot);
    console.log(req.session.first_name);   
    res.render("editsnapshotcheckboxes", { snapshot, triggers, selectedTriggers });
  })
  .catch((error) => {
    console.log(`Error making API request: ${error}`);
    res.status(500).send("An error occurred. Please try again later.");
    res.render('404');
  });
};

//has an API
exports.postAddSnapshot = (req, res) => {
// Extract slider levels and notes from request body
console.log(req.body);
const {
  enjoyment_level,
  surprise_level,
  contempt_level,
  sadness_level,
  fear_level,
  disgust_level,
  anger_level,
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
 console.log(user_ID);
 console.log("Line 157");
console.log(selectedTriggers);
const isoTimestamp = new Date().toISOString();

console.log(isoTimestamp);

const notesValue = notes ? notes : null;
const snapshot = {
  enjoyment_level,
  surprise_level,
  contempt_level,
  sadness_level,
  fear_level,
  disgust_level,
  anger_level,
  user_id: user_ID,
  timestamp: isoTimestamp,
  notes: notesValue
};
console.log(snapshot)
const vals = {snapshot, selectedTriggers};
const endpoint = `http://localhost:3002/newsnapshot`;
axios
.post(endpoint, vals)
.then((response) => {
  const {snapshot_ID} = response.data;
  res.redirect(`/singlesnapshot/${snapshot_ID}`);
})
.catch((error) => {
  
    console.log(`Error making API request: ${error}`);
});
};


//working has API
exports.postDeleteSnapshot = (req, res) => { 

    const { id: snapshot_ID } = req.params;
    const { user_ID } = req.session;
    const vals = {snapshot_ID, user_ID};
    const endpoint = `http://localhost:3002/deletesinglesnapshot/${snapshot_ID}/${user_ID}`;

    axios
        .delete(endpoint, { validateStatus: (status) => { return status < 500 } })
        .then((response) => {
            const status = response.status;
            if (status === 200) {
                res.redirect('/editfav');
            } else {
                console.log(response.status);
                console.log(response.data);
                res.redirect('/allsnapshots');
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
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
