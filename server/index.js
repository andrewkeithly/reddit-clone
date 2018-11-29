const express = require('express');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('./auth/local');
const jwtStrategy = require('./auth/jwt');
const config = require('./config');

const app = express();

app.use(express.json());
app.use(expressValidator());
app.use(morgan('common'));
app.use(passport.initialize());

passport.use(localStrategy);
passport.use(jwtStrategy);

connect();
mongoose.connection.once('open', listen);
mongoose.connection.on('error', console.log);

require('./routes')(app);

app.get('*', (req, res) => {
  res.status(404).json({ message: 'not found' });
});

function listen () {
  app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}`);
  });
}

function connect () {
  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500
  };
  mongoose.connect(
    config.db,
    options
  );
}
