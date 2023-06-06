if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const Register = require("./models/user_register");
const DocRegister = require("./models/doc_register");
const bcrypt = require("bcrypt");
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


const initializePassport = require('./passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// Require Mongoose and establish the connection to the database



const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/medilyf")
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


app.get("/",checkAuthenticated, (req, res) => {
  res.render("index");
});

app.get("/register",checkNotAuthenticated, (req, res) => {
  res.render("register");
});
app.get("/regdoc",checkNotAuthenticated, (req, res) => {
  res.render("regdoc");
});

app.post("/register",checkNotAuthenticated, async (req, res) => {
  try {
    const password = req.body.pass;
    const cpassword = req.body.cpass;
    const hashedpassword = await bcrypt.hash(req.body.pass,10);
    const hashedcpassword = await bcrypt.hash(req.body.cpass,10);
    if (password === cpassword) {
      const registerUser = new Register({
        username: req.body.name,
        email: req.body.email,
        phone: req.body.number,
        password: hashedpassword,
        confirmpassword: hashedcpassword,
      });

      const registered = await registerUser.save();
      res.status(201).render("register");
      res.redirect("login");
    } else {
      res.send("Password not same");
      res.redirect("register");
    }
  } catch (error) {
    res.status(400).send(error);
    res.redirect("register");
  }
  console.log(registerUser);
});

app.post("/regdoc",checkNotAuthenticated, async (req, res) => {
  try {
    const password = req.body.pass;
    const cpassword = req.body.cpass;
    const hashedpassword = await bcrypt.hash(req.body.pass,10);
    const hashedcpassword = await bcrypt.hash(req.body.cpass,10);
    if (password === cpassword) {
      const registerDoc = new DocRegister({
        username: req.body.name,
        email: req.body.email,
        phone: req.body.number,
        password: hashedpassword,
        confirmpassword: hashedcpassword,
      });

      const registered = await registerDoc.save();
      res.status(201).render("register");
      res.redirect("login");
    } else {
      res.send("Password not same");
      res.redirect("regdoc");
    }
  } catch (error) {
    res.status(400).send(error);
    res.redirect("regdoc");
  }
  console.log(registerDoc);
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.get("/login",checkNotAuthenticated, (req, res) => {
  res.render("login");
});


app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}



app.listen(port, () => {
  console.log("Server is running on PORT NO 3000");
});
