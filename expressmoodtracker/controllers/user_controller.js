const conn = require("./../util/dbconn");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const axios = require('axios');

// user controllers that don't need API

exports.getRegisterUser = (req, res) => {
    const {error} = req.query;
  res.render("register", { error });
};

exports.getLogin = (req, res) => {  
  const {error} = req.query;
  res.render("login", { currentPage: "/login", error});
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};


//API attached, tested and working for successful and unsuccessful
exports.postLoginBcrypt = async (req, res) => {
  const { isLoggedIn } = req.session;
  const errors = validationResult(req);  
  if (!errors.isEmpty()) {
    return res.status(422).render("login", { error: errors.array()[0].msg });
  }

  const { username, userpass } = req.body;
  const vals = {
    username: username,
    user_password: userpass
  };
  console.log("about to print vals")
  console.log(vals)
  

  const endpoint = `http://localhost:3002/userdetails/`;

  await axios
  .post(endpoint, vals, { validateStatus: (status) => { return status < 500} })
  .then((response) => {
    if (response.data.message === "Invalid user credentials - user not found.") {
      return res.redirect("/login?error=User not found");
  }
      const status = response.status; 
      if (status === 200) {
          const data = response.data.result;
          console.log(data);
          const hashedPassword = response.data.result[0].user_password;
          console.log("getting hashedPassord")
          console.log(hashedPassword)
          bcrypt.compare(userpass, hashedPassword, (err, result) => {
            if (err) {
              console.error(err);
              return res.status(500).send("Error comparing passwords");
            }
            if (result) {
              // Passwords match
              console.log("password check successful")
              const session = req.session;
              session.isLoggedIn = true;
              session.user_ID = response.data.result[0].user_ID;
              session.first_name = response.data.result[0].first_name;
          
              // Wanted to redirect to original route e.g. add a snapshot but original route lost due to post login and need a quick fix
              return res.redirect('/allsnapshots'); 
          } else {
              // Passwords don't match
              return res.render("login", {
                  currentPage: "/login",
                  error: "Incorrect password",
                  isLoggedIn,
              });
          }
          });         

      } else {
          const data = response.data;
          console.log(data);          
          res.render('login', { loginsuccess: data });
      }
  })
  .catch((error) => {
      console.log(`Error making API request: ${error}`);
  });
};





exports.postRegisterUserv2 = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);


  const vals = {
    username: username,
    password: hashedPassword, 
    firstname: firstname,
    lastname: lastname,
    email: email
  };
  console.log(vals);

  const checkUserVals = {
    username: username
  };

  const errors = validationResult(req);
  console.log(errors.array());
  if (!errors.isEmpty()) {
    return res.status(422).render("register", { error: errors.array()[0].msg });
  }

  try {
    // Check if the username already exists in the database
    const checkUserEndpoint = `http://localhost:3002/userdetails`;

    const response = await axios.put(checkUserEndpoint, checkUserVals);
    console.log(response.data);

    const status = response.status;
    if (status === 200) {
      // Username already exists
      return res.redirect("/register?error=Username taken choose another or login");
    }
  } catch (error) {
    console.log(`Error making API request: ${error}`);
  }

  
    

    const insertUserEndpoint = `http://localhost:3002/registeruser/`;

    try {
      const response = await axios.post(insertUserEndpoint, vals);
      res.redirect("/login");
    } catch (error) {
      console.error(error);
      return res.status(500).send("Error registering user");
    }
 
};