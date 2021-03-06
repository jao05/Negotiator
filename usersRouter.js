const express = require('express');
const router = express.Router();

const passport = require('passport');
const localAuth = passport.authenticate('local', {session: false});

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {User, Negotiator} = require('./models');

// send back JSON representation of all users

router.use(jsonParser);

// on GET requests to root
router.get("/", (req, res) => {
  
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

router.post("/login", localAuth, (req, res) => {
    console.log('login works....');
    res.status(200).json(req.user.serialize());
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

  // To hash the password for security
  return User.hashPassword(req.body.password)    
    .then(hash => {
      return User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: hash        
      });
    })  
    .then(user => {
      res.status(201).json(user.serialize());
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});


// PUT request to edit (modify) user
router.put("/edit", jsonParser, (req, res) => {  

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ["metroArea", "selectedItem"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });
  
  console.log('toUpdate is', toUpdate); // ************************************
  // all key/value pairs in toUpdate will be updated -- that's what `$set` does
  User.findByIdAndUpdate(req.body.userID, toUpdate, {new: true})
  .then(data => {
   res.status(201).json(data.serialize())    
  })
  
  .catch(err => res.status(500).json({ message: "Internal server error" }));   
});

// PUT
router.put("/", jsonParser, (req, res) => {  

  // we only support a subset of fields being updateable.
  // if the user sent over any of the updatableFields, we udpate those values
  // in document
  const toUpdate = {};
  const updateableFields = ["metroArea", "selectedItem", "selectedNegotiator"];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  // Additionally, this is needed to update the user's selected negotiator
  Negotiator.findById(req.body.selectedNegotiator)
  .then(negotiator =>{
    console.log(negotiator);
    toUpdate["selectedNegotiator"] = negotiator;
    User
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.body.userID, { $set: toUpdate })
    .then(user => res.status(201).json(negotiator.serialize()))
    .catch(err => res.status(500).json({ message: "Internal server error" }));
  })  
});

// DELETE
router.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then(user => res.status(204).end())
    .catch(err => res.status(500).json({ message: "Internal server error" }));
});

module.exports = router;