var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../templates/index');
var should = chai.should();

chai.use(chaiHttp);

describe('Parle Lune Pageload', function() {
  it('should load page on / GET', function(done) {
    chai.request(server)
      .get('/')
      .end(function(err, res){
        console.log(res.body);
        res.should.have.status(200);
        res.should.be.html;
        done();
      });
  });
  it('should 404 all other endpoints', function testPath(done) {
    chai.request(server)
      .get('/some/page')
      .end(function(err, res) {
        res.should.have.status(404);
        done();
      });
  });
  it('should prompt for username on pageload');
  it('should display seed messages in chronological order');
  it('should return the color:#69F0AE for other usernames');
});

describe('Parle Lune User Greeting', function() {
  it('should load desired username in greeting');
  it('should return the color:#D84315 for name in greeting');
});

describe('Parle Lune Sessions & Security', function() {
  it('should create a session and save to ./sessions on pageload');
  it('should protect against XSS');
});

describe('Parle Lune Socket Transmission', function() {
  it('should allow message sending');
  it('should display new messages in chronological order');
  it('should display notification when other users are typing');
});