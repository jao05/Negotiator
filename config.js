"use strict";

// Use production database url
exports.DATABASE_URL =
  process.env.DATABASE_URL || "mongodb://localhost/Negotiator";


// Use development database url
exports.TEST_DATABASE_URL =
  //process.env.TEST_DATABASE_URL || "mongodb://localhost/Negotiator";
  process.env.TEST_DATABASE_URL || "mongodb://negotiator-dev-db-user:kboySSS3@ds155292.mlab.com:55292/negotiator-dev-db";
  

exports.PORT = process.env.PORT || 8080;