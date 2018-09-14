const chai = require('chai');
const chaiHttp = require('chai-http');

// Import server.js and use destructuring assignment to create variables for
// server.app, server.runServer, and server.closeServer
const {app, runServer, closeServer} = require('../server');

// declare a variable for expect from chai import
const expect = chai.expect;

chai.use(chaiHttp);


// this function deletes the entire database.
// we'll call it in an `afterEach` block below
// to ensure data from one test does not stick
// around for next one
function tearDownDb() {
  console.warn('Deleting database');
  return mongoose.connection.dropDatabase();
}

function seedNegotiatorData(){
  const seededNegotiators = {
    "agents": [
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
  } 

  return Negotiator.create(seededNegotiators);
}


describe('Serving HTML', function() {
  // Before our tests run, we activate the server. Our `runServer`
  // function returns a promise, and we return the promise by
  // doing `return runServer`. If we didn't return a promise here,
  // there's a possibility of a race condition where our tests start
  // running before our server has started.
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  
  beforeEach(function() {
    return seedNegotiatorData();
  });
  

  afterEach(function() {
    return tearDownDb();
  });
  

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

  describe('GET endpoint', function(){
    // Test the GET request for the /negotiators endpoint  
    it('should return all negotiators',function(){
        // strategy:
        //    1. get back all negotiators returned by GET request to `/negotiators`
        //    2. prove the res has the right status & data type
        //    3. prove the number of posts we got back is equal to number
        //       in db.
        //
        // need to have access to mutate and access `res` across
        // `.then()` calls below, so declare it here so can modify in place
        let res;

        return chai.request(app)
          .get('/negotiators')
          .then(function(_res) {
            // so subsequent .then blocks can access response object
            res = _res;
            expect(res).to.have.status(200);
            // otherwise our db seeding didn't work          
            expect(res.body.agents).to.have.lengthOf.at.least(1);
            return Negotiator.count();
          })
          .then(function(count) {
            
            expect(res.body.agents).to.have.lengthOf(count);
          });
    });

    it('should return negotiators with right fields', function() {
        // Strategy: Get back all negotiators, and ensure they have expected keys

        let resNegotiator;
        return chai.request(app)
          .get('/negotiators')
          .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            
            expect(res.body.agents).to.be.a('array');
            expect(res.body.agents).to.have.lengthOf.at.least(1);

            res.body.agents.forEach(function(agent) {
              expect(agent).to.be.a('object');
              expect(agent).to.include.keys(
                'agentFirstName', 'agentLastName', 'expertise', 'metroArea');
            });
            resNegotiator = res.body.agents[0];
            return Negotiator.findById(resNegotiator.id);
          })
          .then(function(agent) {

            
            expect(resNegotiator.expertise).to.equal(agent.expertise);
            expect(resNegotiator.metroArea).to.equal(agent.metroArea);
            expect(resNegotiator.agentName).to.equal(`${agent.agentFirstName} ${agent.agentLastName}`);
            
          });
      });
  });  

  // Test the POST request for the /negotiators endpoint
  describe('POST endpoint', function() {
    // strategy: make a POST request with data,
    // then prove that the negotiator post we get back has
    // right keys, and that `id` is there (which means
    // the data was inserted into db)
    it('should add a new negotiator', function() {

      const newNegotiator = {
        agentFirstName: "sampleFirstName",
        agentLastName: "sampleLastName",
        metroArea: "sampleCity",
        expertise: "sampleExpertise"
      }

      return chai.request(app)
        .post('/negotiators')
        .send(newNegotiator)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys(
            'agentName', 'metroArea', 'expertise'); // *********Should we only expect keys sent back by serialize function here??******** 
          expect(res.body.metroArea).to.equal(newNegotiator.metroArea);
          // because Mongo should have created id on insertion
          expect(res.body.id).to.not.be.null;
          expect(res.body.expertise).to.equal(newNegotiator.expertise);
          expect(res.body.agentName).to.equal(`${newNegotiator.agentFirstName} ${newNegotiator.agentLastName}`);
          
          return Negotiator.findById(res.body.id);
        })
        .then(function(agent) {
          expect(agent.metroArea).to.equal(newNegotiator.metroArea);
          expect(agent.expertise).to.equal(newNegotiator.expertise);
          expect(agent.agentFirstName).to.equal(newNegotiator.agentFirstName);
          expect(agent.agentLastName).to.equal(newNegotiator.agentLastName);          
        });
    });
  });

  // Test the PUT request for the /negotiators endpoint

  // Test the DELETE request for the /negotiators endpoint
});