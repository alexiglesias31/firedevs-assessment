//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../app');
const should = chai.should()
const expect = chai.expect

const Group = require('../models/group')

chai.use(chaiHttp);

const testSuite = () => {
    describe('Test Groups', () => {
        beforeEach(async function () {
            await Group.deleteMany({})
        })

        // GET
        describe('/GET', () => {
            it('Server should be up and running', (done) => {
                chai.request(server)
                    .get('/api')
                    .end((err, res) => {
                        res.should.have.status(200);
                        assert.equal(res.body, 'Hello from the server')
                        done();
                    });
            });
        });
        describe('/GET groups', () => {
            it('Should get the groups in database', (done) => {
                new Group({
                    name: 'Group A',
                    professor: 'Professor A'
                }).save(function (err, group) {
                    chai.request(server)
                        .get('/api/groups')
                        .end((err, res) => {
                            res.should.have.status(200);
                            expect(res.body).to.be.a.instanceOf(Array);
                            expect(res.body).to.have.length.greaterThanOrEqual(1);
                            expect(res.body[0]).to.have.property('_id');
                            expect(res.body[0]).to.have.property('name');
                            expect(res.body[0]).to.have.property('professor');
                            done();
                        });
                })
            });
        });
        describe('/GET single group', () => {
            it('Should get the right group from database', (done) => {
                const group = new Group({
                    name: 'Group B',
                    professor: 'Professor B',
                })
                group.save()
                    .then(() => {
                        chai.request(server)
                            .get(`/api/groups/${group._id}`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                expect(res.body).to.have.property('_id');
                                assert.equal(res.body._id, group._id);
                                expect(res.body).to.have.property('name');
                                expect(res.body).to.have.property('professor');
                                done();
                            });
                    })
                    .catch(error => done(error))
            });
        });
        describe('/GET single group invalid id', () => {
            it('Should return no group', (done) => {
                chai.request(server)
                    .get('/api/groups/111111111111111111111111')
                    .end((err, res) => {
                        res.should.have.status(400);
                        assert.equal(res.body, 'Group do not exist');
                        done();
                    });
            });
        });

        // POST
        describe('/POST groups', () => {
            it('Should add a new group to database', (done) => {
                chai.request(server)
                    .post('/api/groups')
                    .send({
                        name: 'Group C',
                        professor: 'Professor C',
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(res.body).to.have.property('_id');
                        expect(res.body).to.have.property('name');
                        expect(res.body).to.have.property('professor');
                        done();
                    });
            });
        });
        describe('/POST groups', () => {
            it('Error name missing field', (done) => {
                chai.request(server)
                    .post('/api/groups')
                    .send({
                        professor: 'Professor D',
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        assert.equal(res.body, 'Required field name missing')
                        done();
                    });
            });
        });
        describe('/POST groups', () => {
            it('Error professor missing field', (done) => {
                chai.request(server)
                    .post('/api/groups')
                    .send({
                        name: 'Group D',
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        assert.equal(res.body, 'Required field professor missing')
                        done();
                    });
            });
        });
        describe('/POST single group', () => {
            it('Update the right group from database', (done) => {
                const group = new Group({
                    name: 'Group E',
                    professor: 'Professor E',
                })
                group.save()
                    .then(() => {
                        chai.request(server)
                            .post(`/api/groups/${group._id}`)
                            .send({
                                name: 'Group Update',
                            })
                            .end((err, res) => {
                                res.should.have.status(200);
                                expect(res.body).to.have.property('_id');
                                assert.equal(res.body._id, group._id);
                                assert.equal(res.body.name, 'Group Update');
                                expect(res.body).to.have.property('name');
                                expect(res.body).to.have.property('professor');
                                done();
                            });
                    })
                    .catch(error => done(error))
            });
        });
        describe('/POST update not existing group', () => {
            it('Should return an error', (done) => {
                chai.request(server)
                    .post('/api/groups/111111111111111111111111')
                    .send({
                        name: 'Group Update',
                    })
                    .end((err, res) => {
                        res.should.have.status(400);
                        assert.equal(res.body, 'Group do not exist');
                        done();
                    });
            });
        });

        // DELETE
        describe('/DELETE groups', () => {
            it('Should delete all groups', (done) => {
                chai.request(server)
                    .delete('/api/groups')
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(res.body).to.be.equal('Complete delete successfully')
                        done();
                    });
            });
        });
        describe('/DELETE single group', () => {
            it('Should delete a single group', (done) => {
                const group = new Group({
                    name: 'Group F',
                    professor: 'Professor F',
                })
                group.save()
                    .then(() => {
                        chai.request(server)
                            .delete(`/api/groups/${group._id}`)
                            .end((err, res) => {
                                res.should.have.status(200);
                                assert.equal(res.body, 'Delete successful');
                                done();
                            });
                    })
                    .catch(error => done(error))
            });
        });
        describe('/DELETE non existing group', () => {
            it('Should return an error', (done) => {
                chai.request(server)
                    .delete('/api/groups/111111111111111111111111')
                    .end((err, res) => {
                        res.should.have.status(400);
                        assert.equal(res.body, 'Group do not exist');
                        done();
                    });
            });
        });
    });
}

module.exports = testSuite()