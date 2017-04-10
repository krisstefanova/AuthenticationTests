// tests
let mocha = require('mocha');
let chai = require('chai');
let request = require('request');

let baseURL = "https://test-api.lescapes.com";
let expect = chai.expect;

// some initial details that are used in many tests in this describe block
let userDetails = {
  registerEmail: "test" + Date.now() + "@domain.com",
  givenName: "TestName",
  surname: "TestFamilyName",
  loginEmail: "test@domain.com",
  password: "1234567",
  wrongPassword: "wrongPassword"
};

describe("Test 'register' endpoint", () => {
  let endpoint = "/register";

  it("shouldn't register a user without all required fields", (done) => {
    let userData = {
      email: userDetails.registerEmail,
      givenName: userDetails.givenName,
      surname: userDetails.surname
    };

    request.post({
      url: baseURL + endpoint,
      json: userData
    }, (error, res, body) => {
      expect(res.statusCode).to.equal(400);
      expect(body).to.have.property("message");
      done();
    });
  });

  it("should register a user when all unique data supplied", (done) => {
    let userData = {
      email: userDetails.registerEmail,
      givenName: userDetails.givenName,
      surname: userDetails.surname,
      password: userDetails.password
    };

    request.post({
      url: baseURL + endpoint,
      json: userData
    }, (error, res, body) => {
      expect(res.statusCode).to.equal(201);
      expect(body).to.have.property("account");
      expect(body.account).to.have.property("email");
      expect(body.account.email).to.eql(userDetails.registerEmail);
      expect(body.account).to.have.property("status");
      expect(body.account).to.have.property("memberId");
      done();
    });
  });

  it("shouldn't register a user with already registered email", (done) => {
    let userData = {
      email: userDetails.registerEmail,
      givenName: userDetails.givenName,
      surname: userDetails.surname,
      password: userDetails.password
    };

    request.post({
      url: baseURL + endpoint,
      json: userData
    }, (error, res, body) => {
      expect(res.statusCode).to.equal(409);
      expect(body).to.have.property("message");
      done();
    });
  });
});

//==============================================================================

describe("Test 'login' end-point", () => {
  let endpoint = "/login";

  it("should login a user", (done) => {
    let userData = {
      "login": userDetails.loginEmail,
      "password": userDetails.password
    };

    request.post({
      url: baseURL + endpoint,
      json: userData
    }, (error, res, body) => {
      expect(res.statusCode).to.equal(200);
      expect(body).to.have.property("account");
      expect(body.account).to.have.property("email");
      expect(body.account.email).to.eql(userDetails.loginEmail);
      expect(body.account).to.have.property("username");
      expect(body.account.username).to.eql(userDetails.loginEmail);
      expect(body.account).to.have.property("memberId")
      done();
    });
  });

  it("shouldn't login a user with a wrong password", (done) => {
    let userData = {
      "login": userDetails.loginEmail,
      "password": userDetails.wrongPassword
    }

    request.post({
      url: baseURL + endpoint,
      json: userData
    }, (error, res, body) => {
      expect(res.statusCode).to.equal(401);
      expect(body).to.have.property("message");
      done();
    });
  });
});

//==============================================================================

describe("Test 'me' endpoint", () => {
  let endpoint = "/me";

  it("shouldn't succeed to check for profile page without a cookie", (done) => {
    request.get({
      url: baseURL + endpoint,
      json: {}
    }, function(error, response, body){
      expect(response.statusCode).to.equal(401);
      expect(body).to.have.property("message");
      done();
    })
  });

  it("should open the profile page with a cookie", (done) => {
    // login first in order to obtain the cookie
    let userData = {
      "login": userDetails.loginEmail,
      "password": userDetails.password
    }

    request.post({
      url: baseURL + '/login',
      json: userData
    }, (error, res, body) => {
      let cookieJar = request.jar();
      let cookie;

      if (res.headers && res.headers['set-cookie']) {
        cookie = request.cookie(res.headers['set-cookie'][0]);
      } else {
        cookie = "";
      }

      cookieJar.setCookie(cookie, baseURL + endpoint);

      // having the cookie, do the actual "get profile" service test
      request.get({
        url: baseURL + endpoint,
        jar: cookieJar,
        json: {}
      }, (error, res, body) => {
        expect(res.statusCode).to.equal(200);
        expect(body).to.have.property("account");
        expect(body.account).to.have.property("email");
        expect(body.account.email).to.eql(userDetails.loginEmail);
        expect(body.account).to.have.property("username");
        expect(body.account.username).to.eql(userDetails.loginEmail);
        expect(body.account).to.have.property("givenName");
        expect(body.account).to.have.property("surname");
        done();
      });
    });
  });
});
