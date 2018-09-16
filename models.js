"use strict";

const mongoose = require("mongoose");

// this is our schema to represent a negotiator
const negotiatorSchema = mongoose.Schema({
  agentFirstName: { type: String, required: true },
  agentLastName: { type: String, required: true },
  metroArea: { type: String, required: true },
  expertise: { type: String, required: true },  
});

// *virtuals* (http://mongoosejs.com/docs/guide.html#virtuals)
// allow us to define properties on our object that manipulate
// properties that are stored in the database.
// Here's a virtual that combines agent's first name & last name into one string
negotiatorSchema.virtual("agentNameString").get(function() {
  return `${this.agentFirstName} ${this.agentLastName}`.trim();
});

// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
negotiatorSchema.methods.serialize = function() {
  return {
    id: this._id,
    agentName: this.agentNameString,
    expertise: this.expertise,
    metroArea: this.metroArea
  };
};

// this is our schema to represent a client user
const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  metroArea: { type: String, required: true },
  selectedItem: { type: String, required: true },
  selectedNegotiator: { type: mongoose.Schema.Types.ObjectId, ref: 'Negotiator' },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

userSchema.pre('find', function(next) {
  this.populate('selectedNegotiator');
  next();
});

userSchema.pre('findOne', function(next) {
  this.populate('selectedNegotiator');
  next();
});

userSchema.virtual("fullNameString").get(function() {
  return `${this.firstName} ${this.lastName}`.trim();
});

userSchema.methods.serialize = function() {
  return {
    id: this._id,
    fullName: this.fullNameString,
    selectedItem: this.selectedItem,
    metroArea: this.metroArea
  };
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Negotiator = mongoose.model("Negotiator", negotiatorSchema);
const User = mongoose.model("User", userSchema);

module.exports = { Negotiator, User };