// Refactored to move all book router codes into a single js file

var express = require('express');
// define book model

var routes = function (Book) {
    // Create a router/middleware for handling all routes
    var bookrouter = express.Router();
    // Create all routes for the Books endpoint
    bookrouter.route('/')
        .post(function (req, res) {
            var book = new Book(req.body);
            book.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Saved in DB");
                }
            });
            res.status(201).send(book);
        })
        .get(function (req, res) {
            // Get query from url
            var query = req.query;
            // Validate query parameter
            if (req.query.genre) {
                query.genre = req.query.genre;
            }
            // find books in db
            Book.find(query, (err, books) => {
                if (err)
                    // Send error 
                    res.status(500).send(err);
                else
                    // Send booksfrom db formatted as json
                    res.json(books);
            });
        });
    bookrouter.route('/:id')
        .get(function (req, res) {
            // find books in db
            Book.findById(req.params.id, (err, book) => {
                if (err)
                    // Send error 
                    res.status(500).send(err);
                else
                    // Send book from db formatted as json
                    res.json(book);
            });
        });
    return bookrouter;
};

module.exports = routes;