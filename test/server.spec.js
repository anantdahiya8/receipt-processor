let chai = require('chai');
let chaiHttp = require('chai-http');
const { response } = require('express');
let app = require('../server');
let validReceipt = require('./resources/validReceipt');
let validReceipt2 = require('./resources/validReceipt2');
let missingRetailerReceipt = require('./resources/missingRetailerReceipt');
let incorrectTotalReceipt = require('./resources/incorrectTotalReceipt');
let incorrectTimeReceipt = require('./resources/incorrectTimeReceipt');
let emptyDescReceipt = require('./resources/emptyDescReceipt');




chai.should();
chai.use(chaiHttp);

describe('test Get points api', async () => {
  let validId;
  before(() => {
    chai.request(app).post("/receipts/process").send(validReceipt).end((err, res) => {
      validId = res.body.id;
    })
  })

  it('when incorrect id is provided as input', (done) => {
    chai.request(app).get("/receipts/1234/points").end((err, res) => {
      res.should.have.status(400);
      res.body.message.should.be.eq('ID not present.');
      done();
    })
  })

  it('when valid id is provided as input', (done) => {
    chai.request(app).get("/receipts/" + validId + "/points").end((err, res) => {
      res.should.have.status(200);
      res.body.should.include.keys("points");
      done();
    })
  })
})


describe('test Post receipts api', () => {
  it('when correct receipt is provided as input', (done) => {
    chai.request(app).post("/receipts/process").send(validReceipt).end((err, res) => {
      res.should.have.status(200);
      res.body.should.include.keys("id");
      done();
    })
  })

  it('when missing retailer is provided as input', (done) => {
    chai.request(app).post("/receipts/process").send(missingRetailerReceipt).end((err, res) => {
      res.should.have.status(400);
      res.body.should.include.keys("message");
      res.body.message.should.be.eq('"retailer" is required');
      done();
    })
  })

  it('when incorrect total is provided as input', (done) => {
    chai.request(app).post("/receipts/process").send(incorrectTotalReceipt).end((err, res) => {
      res.should.have.status(400);
      res.body.should.include.keys("message");
      res.body.message.should.be.eq('Please check the total amount.');
      done();
    })
  })

  it('when incorrect time is provided as input', (done) => {
    chai.request(app).post("/receipts/process").send(incorrectTimeReceipt).end((err, res) => {
      res.should.have.status(400);
      res.body.should.include.keys("message");
      res.body.message.should.be.eq('"purchaseTime" with value "24:99" fails to match the required pattern: /^([01][0-9]|2[0-3]):([0-5][0-9])$/');
      done();
    })
  })

  it('when empty description is provided as input', (done) => {
    chai.request(app).post("/receipts/process").send(emptyDescReceipt).end((err, res) => {
      res.should.have.status(400);
      res.body.should.include.keys("message");
      res.body.message.should.be.eq('"items[0].shortDescription" is not allowed to be empty');
      done();
    })
  })

  it('check if points are correcty calculated 1', (done) => {
    chai.request(app).post("/receipts/process").send(validReceipt).end((err, res) => {
      res.should.have.status(200);
      res.body.should.include.keys("id");
      const id = res.body.id;
      chai.request(app).get("/receipts/" + id + "/points").end((err, res) => {
        res.should.have.status(200);
        res.body.should.include.keys("points");
        res.body.points.should.be.eq(109);
        done();
      })
    })
  })

  it('check if points are correcty calculated 2', (done) => {
    chai.request(app).post("/receipts/process").send(validReceipt2).end((err, res) => {
      res.should.have.status(200);
      res.body.should.include.keys("id");
      const id = res.body.id;
      chai.request(app).get("/receipts/" + id + "/points").end((err, res) => {
        res.should.have.status(200);
        res.body.should.include.keys("points");
        res.body.points.should.be.eq(28);
        done();
      })
    })
  })
})

