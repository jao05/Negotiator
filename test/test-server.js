const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);

/**********************************************
// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

function seedNegotiatorData(){
  const seededNegotiators = [
    {
      agentFirstName: "John",
      agentLastName: "Carson",
      metroArea: "New York City",
      expertise: "Car" 
    },
    {
      agentFirstName: "Jane",
      agentLastName: "Doe",
      metroArea: "Atlanta",
      expertise: "Car" 
    },
    {
      agentFirstName: "Jim",
      agentLastName: "Homer",
      metroArea: "Los Angeles",
      expertise: "Home" 
    },
    {
      agentFirstName: "Jackie",
      agentLastName: "Boatman",
      metroArea: "Miami",
      expertise: "Boat" 
    }
  ] 

  return BlogPost.create(seededNegotiators);
}
******************************************************/

describe('Serving HTML', function() {
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    return runServer();
  });

  /************************
  beforeEach(function() {
    return seedBlogData();
  });
  

  afterEach(function() {
    return tearDownDb();
  });
  ***************************/

  // Close server after these tests run in case
  // we have other test modules that need to 
  // call `runServer`. If server is already running,
  // `runServer` will error out.
  after(function() {
    return closeServer();
  });
  // `chai.request.get` is an asynchronous operation. When
  // using Mocha with async operations, we need to either
  // return an ES6 promise or else pass a `done` callback to the
  // test that we call at the end. We prefer the first approach, so
  // we just return the chained `chai.request.get` object.
  it('should serve HTML file', function() {
    return chai.request(app)
      .get('/')
      .then(function(res) {
        expect(res).to.have.status(200);
        expect(res).to.be.html;        
      });
  });
});