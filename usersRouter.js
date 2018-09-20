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
// DELETE