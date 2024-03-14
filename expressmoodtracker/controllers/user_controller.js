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


//OLD VERSION!! WORKS WITHOUT API
// exports.postLoginBcrypt = (req, res) => {
//   const { isLoggedIn } = req.session;
//   const errors = validationResult(req);  
//   if (!errors.isEmpty()) {
//     return res.status(422).render("login", { error: errors.array()[0].msg });
//   }

//   const { username, userpass } = req.body;
//   const vals = [username, userpass];
  

//   const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? `;

//   conn.query(checkuserSQL, vals, (err, rows) => {
//     if (err) {
//       console.error(err);
//       return res.status(500).send("Error checking username"); 
//     }
//     if (rows.length === 0) {
//       return res.redirect("/login?error=User not found");
//     };
    
//     const hashedPassword = rows[0].user_password;
//     bcrypt.compare(userpass, hashedPassword, (err, result) => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send("Error comparing passwords");
//       }
//       if (result) {
//         const session = req.session;
//         session.isLoggedIn = true;
//         session.user_ID = rows[0].user_ID;
//         session.first_name = rows[0].first_name;
//         const {user_ID} = req.session
//         console.log(`postLogin: session: ${session}`);
//         console.log(`user number: ${session.user_ID}`);

//         var orig_route = session.route;
//         console.log(`postLogin: orig_route: ${orig_route}`);
//         if (!orig_route) {
//           orig_route = "/allsnapshots", {user_ID};
//         }
//         return res.redirect(orig_route);
//       } else {
//         return res.render("login", {
//           currentPage: "/login",
//           error: "Incorrect password",
//           isLoggedIn,
//         });
//       }
//     });
//   });
// };

//works for successful logins
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
  

  const endpoint = `http://localhost:3002/userlogin/`;

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









    
   
  









exports.postRegisterUser = async (req, res) => {
  const { username, password, firstname, lastname, email } = req.body;
  console.log(req.body);
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
            "/register?error=Username taken choose another or login"
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
          "INSERT INTO user_details (username, user_password, first_name, last_name, email_address) VALUES (?, ?, ?, ?, ?)";
        conn.query(insertSQL, [username, hash, firstname, lastname, email], (error, result) => {
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

