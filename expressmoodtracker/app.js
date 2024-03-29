const express = require("express");
const morgan = require("morgan");
const path = require("path");
const dotenv = require("dotenv").config({ path: "./config.env" });
const session = require("express-session");
const router = require("./routes/myroutes");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const {navbarMiddleware} = require("./middleware/navbar");

const app = express();

app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "/public")));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: "thesecretstring",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(navbarMiddleware);

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "script-src": [
          "'self'",
          "cdn.jsdelivr.net",
          "cdnjs.cloudflare.com",
          "'unsafe-inline'",
        ],
      },
    },
  })
);
app.use("/", router);

app.use('*', (req, res) => {
    res.status(404).render('404');
});

app.listen(process.env.PORT, (err) => {
  if (err) return console.log(err);

  console.log(`Express listening on port ${process.env.PORT}`);
});
