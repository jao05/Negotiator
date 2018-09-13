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

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Negotiator = mongoose.model("Negotiator", negotiatorSchema);

module.exports = { Negotiator };