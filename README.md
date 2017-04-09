# Integration authentication tests

The tests are using mocha and chai npm modules. Three endpoints are tested - register, login and get profile pages. I use require npm module for http requests/responses. At the point of writing the tests, all pass except one - register a user with already registered email. The test doesn't create a user as it shouldn't but the response is not in JSON format which is the reason the test fails.

***

## Installation

If you would like to download the code and try it for yourself:

1. Clone the repo:
>$ git clone https://github.com/krisstefanova/AuthenticationTests.git

2. Install the packages:
>$ npm install

3. Launch:
>$ npm test

## Some API suggestions
- Add a service that deletes a customer account because with the registration tests, every time a new user that will never be used is added. The service can be used in an after hook. Currently I've work-arounded it using a random timestamp in the registration email which is not very elegant.
