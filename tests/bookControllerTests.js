var should = require('should'),
    sinon = require('sinon');

describe("Book Controller tests", function() {
    describe("Post tests", function() {
        it("Should not have an empty title", function() {
            // Mock book
            var Book = function(book) {this.save = function() {}};

            // Mock request
            var req = {
                body: {
                    "Author": "Arpan"
                }
            }

            // Mock response
            var res = {
                status: sinon.spy(),
                send: sinon.spy()
            }
            
            // Initialize controller with mock book
            var bookController = require('../controllers/bookController')(Book);

            bookController.post(req, res);

            res.status.calledWith(400).should.equal(true, "Bad Status");
            res.send.calledWith("Title is required").should.equal(true);
        })
    })
})