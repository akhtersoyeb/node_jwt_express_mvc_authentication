const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const env = require('dotenv');
const { requireAuth, checkUser } = require('./middleWare/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
env.config();

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// import the routes
const authRouter = require('./routes/authRouter');

// use routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use(authRouter);