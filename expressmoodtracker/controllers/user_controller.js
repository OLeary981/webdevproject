const conn = require("./../util/dbconn");
const pool = require("./../util/dbconn");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");


// user controllers 


exports.getRegisterUser = (req, res) => {
    const {error} = req.query;
  res.render("register", { error }); //add protection etc so can only register if not logged in?
};

exports.getLogin = (req, res) => {
  const { isLoggedIn } = req.session;
  const {error} = req.query;
  res.render("login", { currentPage: "/login", isLoggedIn, error});
};

exports.getLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
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



  const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? `;

  conn.query(checkuserSQL, vals, (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error checking username"); //consider changing this to something more graceful
    }

    if (rows.length === 0) {
      return res.redirect("/login?error=User not found");
    };
    console.log("About to print rows");
    console.log(rows);
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



// exports.postLogin = (req, res) => {
//   const errors = validationResult(req);
//   console.log(errors.array());
//   if (!errors.isEmpty()) {
//     return res.status(422).render("login", { error: errors.array()[0].msg });
//   }

//   const { username, userpass } = req.body;
//   const vals = [username, userpass];
//   console.log(`postLogin vals: ${vals}`);

//   /*
//     const checkuserSQL = `SELECT * FROM favourites_users WHERE favourites_users.username = '${ username }' 
//                             AND favourites_users.password = '${ userpass }'`;
//     */

//   const checkuserSQL = `SELECT * FROM user_details WHERE user_details.username = ? 
//                             AND user_details.user_password = ?`;

//   conn.query(checkuserSQL, vals, (err, rows) => {
//     if (err) throw err;

//     if (rows.length > 0) {
//       const session = req.session;
//       session.isLoggedIn = true;
//       console.log(`postLogin: session: ${session}`);

//       var orig_route = session.route;
//       console.log(`postLogin: orig_route: ${orig_route}`);

//       if (!orig_route) {
//         orig_route = "/";
//       }
//       res.redirect(`${orig_route}`);

//       //res.redirect('/');
//     } else {
//       res.redirect("/");
//     }
//   });
// };
