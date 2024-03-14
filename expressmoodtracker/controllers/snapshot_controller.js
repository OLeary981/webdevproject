const axios = require('axios');


// basic page controllers

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
    console.log("Printing snapshot from the getEditSnapshot controller")
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
                res.redirect('/allsnapshots');
            } else {
                console.log(response.status);
                console.log(response.data);
                res.send(`<script>alert('Delete unsuccessful. Please try again.'); window.location='/allsnapshots';</script>`);
            }
        })
        .catch((error) => {
            console.log(`Error making API request: ${error}`);
        });
};

//has API working
exports.postEditSnapshot = (req, res) => {
  // Extract slider levels and notes from request body
  console.log(req.body);
  let {
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
  
  const { id: snapshot_ID } = req.params;
   const { user_ID } = req.session;
   console.log(user_ID);
   console.log("Line 382");
  console.log(selectedTriggers);
  
  enjoyment_level=parseInt(enjoyment_level);
  surprise_level = parseInt(surprise_level);
  contempt_level = parseInt(contempt_level);
  sadness_level = parseInt(sadness_level);
  fear_level = parseInt(fear_level);
  disgust_level = parseInt(disgust_level);
  anger_level = parseInt(anger_level);
  
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
    notes: notesValue
  };
  console.log(snapshot)
  const vals = {snapshot, selectedTriggers};
  console.log("snapshot id:"); 
  console.log(snapshot_ID);
  console.log(vals);
  //const endpoint = `http://localhost:3002/editsnapshot/${snapshot_ID}`;
  const endpoint = `http://localhost:3002/editsnapshot/${snapshot_ID}`;
  axios
  .put(endpoint, vals)
  .then((response) => {
    const {snapshot_ID} = response.data;
    res.redirect(`/singlesnapshot/${snapshot_ID}`);
  })
  .catch((error) => {
    
      console.log(`Error making API request: ${error}`);
      console.log(error.message);
  });
  };