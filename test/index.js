//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chaiHttp = require('chai-http');
const chai = require('chai');

chai.use(chaiHttp);

describe("Test Suite", function () {
    describe('Student Test', () => {
        require('./tests_students')
    })
    describe('Group Test', () => {
        require('./tests_groups')
    })
});