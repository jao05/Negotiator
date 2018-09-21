const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User} = require('./models');

// send back JSON representation of all users
// on GET requests to root
router.get('/', (req, res) => {
  
  User.find()

  	// success callback: for each user we got back, we'll
    // call the `.serialize` instance method we've created in
    // models.js in order to only expose the data we want the API return.    
    .then(users => {
      res.json({
        users: users.map(user => user.serialize())
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });

});

// POST requests to '/users' endpoint
router.post("/", jsonParser, (req, res) => {
  const requiredFields = ["firstName", "lastName", "username", "password"];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }  

  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,    
    username: req.body.username,
    password: req.body.password,
  })
  .then(user => {
    res.status(201).json(user.serialize());
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

// PUT
app.put("/users/:id", jsonParser, (req, res) => {
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
  const updateableFields = ["username", "password"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  User
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate })
    .then(user => res.status(201).json(user.serialize()))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

// DELETE
app.delete("/users/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.export.router;