//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../app');
const should = chai.should()
const expect = chai.expect

const Student = require('../models/student')
const Group = require('../models/student')

chai.use(chaiHttp);

describe('Test', () => {
    beforeEach(async function () {
        await Student.deleteMany({})
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
    describe('/GET students', () => {
        it('Should get the students in database', (done) => {
            new Student({
                name: 'Student A',
                email: 'test_get_students@student.com',
                sex: 'M',
                age: '25',
                birthdate: '1990-10-21',
                city: 'Santa Clara',
                groupId: '1423'
            }).save(function (err, student) {
                chai.request(server)
                    .get('/api/students')
                    .end((err, res) => {
                        res.should.have.status(200);
                        expect(res.body).to.be.a.instanceOf(Array);
                        expect(res.body).to.have.length.greaterThanOrEqual(1);
                        expect(res.body[0]).to.have.property('_id');
                        expect(res.body[0]).to.have.property('name');
                        expect(res.body[0]).to.have.property('email');
                        expect(res.body[0]).to.have.property('sex');
                        expect(res.body[0]).to.have.property('age');
                        expect(res.body[0]).to.have.property('birthdate');
                        expect(res.body[0]).to.have.property('city');
                        expect(res.body[0]).to.have.property('groupId');
                        done();
                    });
            })
        });
    });
    describe('/GET single student', () => {
        it('Should get the right student from database', (done) => {
            const student = new Student({
                name: 'Student A',
                email: 'test_get_single_student@student.com',
                sex: 'M',
                age: '25',
                birthdate: '1990-10-21',
                city: 'Santa Clara',
                groupId: '1423'
            })
            student.save()
                .then(() => {
                    chai.request(server)
                        .get(`/api/students/${student._id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            expect(res.body).to.have.property('_id');
                            assert.equal(res.body._id, student._id);
                            expect(res.body).to.have.property('name');
                            expect(res.body).to.have.property('email');
                            expect(res.body).to.have.property('sex');
                            expect(res.body).to.have.property('age');
                            expect(res.body).to.have.property('birthdate');
                            expect(res.body).to.have.property('city');
                            expect(res.body).to.have.property('groupId');
                            done();
                        });
                })
                .catch(error => done(error))
        });
    });
    describe('/GET single student invalid id', () => {
        it('Should return no student', (done) => {
            chai.request(server)
            .get('/api/students/111111111111111111111111')
            .end((err, res) => {
                res.should.have.status(400);
                assert.equal(res.body, 'Student do not exist');
                done();
            });
        });
    });

    // POST
    describe('/POST students', () => {
        it('Should add a new student to database', (done) => {
            chai.request(server)
                .post('/api/students')
                .send({
                    name: 'Student A',
                    email: 'test_add_student@student.com',
                    sex: 'M',
                    age: '25',
                    birthdate: '1990-10-21',
                    city: 'Santa Clara',
                    groupId: '1423'
                })
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.have.property('_id');
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('email');
                    expect(res.body).to.have.property('sex');
                    expect(res.body).to.have.property('age');
                    expect(res.body).to.have.property('birthdate');
                    expect(res.body).to.have.property('city');
                    expect(res.body).to.have.property('groupId');
                    done();
                });
        });
    });
    describe('/POST students', () => {
        it('Error on student with wrong age field', (done) => {
            chai.request(server)
                .post('/api/students')
                .send({
                    name: 'Student A',
                    email: 'test_bad_age@student',
                    sex: 'M',
                    age: '-2',
                    birthdate: '1990-10-21',
                    city: 'Santa Clara',
                    groupId: '1423'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    assert.equal(res.body, 'Age field is not valid')
                    done();
                });
        });
    });
    describe('/POST students', () => {
        it('Error on student with wrong email field', (done) => {
            chai.request(server)
                .post('/api/students')
                .send({
                    name: 'Student A',
                    email: 'test_bad_email@student',
                    sex: 'M',
                    age: '25',
                    birthdate: '1990-10-21',
                    city: 'Santa Clara',
                    groupId: '1423'
                })
                .end((err, res) => {
                    res.should.have.status(400);
                    assert.equal(res.body, 'Email field is not valid')
                    done();
                });
        });
    });
    describe('/POST single student missing fields', () => {
        it('Should return an error', (done) => {
            const student = new Student({
                name: 'Student A',
                email: 'test_update_missing_field@student.com',
                sex: 'M',
                age: '25',
                birthdate: '1990-10-21',
                city: 'Santa Clara',
                groupId: '1423'
            })
            student.save()
                .then(() => {
                    chai.request(server)
                        .post(`/api/students/${student._id}`)
                        .send({})
                        .end((err, res) => {
                            res.should.have.status(400);
                            assert.equal(res.body, 'Required field(s) missing');
                            done();
                        });
                })
                .catch(error => done(error))
        })
    });
    describe('/POST single student', () => {
        it('Update the right student from database', (done) => {
            const student = new Student({
                name: 'Student A',
                email: 'test_get_single_student@student.com',
                sex: 'M',
                age: '25',
                birthdate: '1990-10-21',
                city: 'Santa Clara',
                groupId: '1423'
            })
            student.save()
                .then(() => {
                    chai.request(server)
                        .post(`/api/students/${student._id}`)
                        .send({
                            name: 'Student Update',
                            email: 'test_update_single@student.com',
                            sex: 'M',
                            age: '25',
                            birthdate: '1990-10-21',
                            city: 'Santa Clara',
                            groupId: '1423'
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            expect(res.body).to.have.property('_id');
                            assert.equal(res.body._id, student._id);
                            assert.equal(res.body.name, 'Student Update');
                            expect(res.body).to.have.property('name');
                            expect(res.body).to.have.property('email');
                            expect(res.body).to.have.property('sex');
                            expect(res.body).to.have.property('age');
                            expect(res.body).to.have.property('birthdate');
                            expect(res.body).to.have.property('city');
                            expect(res.body).to.have.property('groupId');
                            done();
                        });
                })
                .catch(error => done(error))
        });
    });
    describe('/POST update not existing student', () => {
        it('Should return an error', (done) => {
            chai.request(server)
            .post('/api/students/111111111111111111111111')
            .send({
                name: 'Student Update',
                email: 'test_update_single@student.com',
                sex: 'M',
                age: '25',
                birthdate: '1990-10-21',
                city: 'Santa Clara',
                groupId: '1423'
            })
            .end((err, res) => {
                res.should.have.status(400);
                assert.equal(res.body, 'Student do not exist');
                done();
            });
        });
    });

    // DELETE
    describe('/DELETE students', () => {
        it('Should delete all students', (done) => {
            chai.request(server)
                .delete('/api/students')
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.be.equal('Complete delete successfully')
                    done();
                });
        });
    });
    describe('/DELETE single student', () => {
        it('Should delete a single student', (done) => {
            const student = new Student({
                name: 'Student A',
                email: 'test_get_single_student@student.com',
                sex: 'M',
                age: '25',
                birthdate: '1990-10-21',
                city: 'Santa Clara',
                groupId: '1423'
            })
            student.save()
                .then(() => {
                    chai.request(server)
                        .delete(`/api/students/${student._id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            assert.equal(res.body, 'Delete successful');
                            done();
                        });
                })
                .catch(error => done(error))
        });
    });
    describe('/DELETE non existing student', () => {
        it('Should return an error', (done) => {
            chai.request(server)
            .delete('/api/students/111111111111111111111111')
            .end((err, res) => {
                res.should.have.status(400);
                assert.equal(res.body, 'Student do not exist');
                done();
            });
        });
    });

});