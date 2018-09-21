"use strict";

// Use production database url
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/Negotiator";


// Use development database url
exports.TEST_DATABASE_URL =
  //process.env.TEST_DATABASE_URL || "mongodb://localhost/Negotiator";
  process.env.TEST_DATABASE_URL || "mongodb://localhost/Negotiator";
  

exports.PORT = process.env.PORT || 8080;