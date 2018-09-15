const express = require('express');
const app = express();
const morgan = require('morgan');

// To parse json in requests
const bodyParser = require('body-parser'); 
const jsonParser = bodyParser.json();

app.use(express.static('public'));
app.use(morgan('common'));

require('dotenv').config()

const mongoose = require('mongoose');

// Mongoose internally uses a promise-like object,
// but it's better to make Mongoose use built in es6 promises
mongoose.Promise = global.Promise;

// config.js is where we control constants for entire
// app like PORT and DATABASE_URL
const {PORT, DATABASE_URL} = require('./config');

// Import the Negotiator model
const { Negotiator } = require("./models");

// GET requests to '/negotiators' endpoint
app.get("/negotiators", (req, res) => {
  Negotiator.find()
    
    // success callback: for each negotiator we got back, we'll
    // call the `.serialize` instance method we've created in
    // models.js in order to only expose the data we want the API return.    
    .then(negotiators => {
      res.json({
        negotiators: negotiators.map(negotiator => negotiator.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

// POST requests to '/negotiators' endpoint
app.post("/negotiators", jsonParser, (req, res) => {
  const requiredFields = ["agentFirstName", "agentLastName", "metroArea", "expertise"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }  

  Negotiator.create({
    agentFirstName: req.body.agentFirstName,
    agentLastName: req.body.agentLastName,
    metroArea: req.body.metroArea,
    expertise: req.body.expertise
  })
  .then(negotiator => {
    res.status(201).json(negotiator.serialize());
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

// PUT requests to '/negotiators' endpoint
app.put("/negotiators/:id", (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message =
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`;
    console.error(message);
    return res.status(400).json({ message: message });
  }

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ["metroArea", "expertise"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Negotiator
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(negotiator => res.status(201).json(negotiator.serialize()))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE requests to '/negotiators' endpoint
app.delete("/negotiators/:id", (req, res) => {
  Negotiator.findByIdAndRemove(req.params.id)
    .then(negotiator => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// catch-all endpoint if client makes request to non-existent endpoint
app.use("*", function(req, res) {
  res.status(404).json({ message: "Not Found" });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in runServer
let server;

// this function starts our server and returns a Promise.
// In our test code, we need a way of asynchronously starting
// our server, since we'll be dealing with promises there.
function runServer(databaseUrl, port = PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

// like `runServer`, this function also needs to return a promise.
// `server.close` does not return a promise on its own, so we manually
// create one.
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };