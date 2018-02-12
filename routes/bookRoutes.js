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
    // Add middleware to handle common book finding activities in all :id routes
    bookrouter.use('/:id', function(req, res, next) {
        // Find books in db
        Book.findById(req.params.id, (err, book) => {
            if (err) {
                res.status(500).send(err);
            }
            // if book found
            else if (book) {
                req.book = book; // set book variable in request
                next(); // Call whatever is in route next (get, put, patch...)
            }
            // if book not found
            else {
                res.status(404).send('Book not found');
            }
        });
    });
    
    bookrouter.route('/:id')
        .get(function (req, res) {
            res.json(req.book);
        })
        .put(function (req, res) {
            req.book.title = req.body.title;
            req.book.genre = req.body.genre;
            req.book.author = req.body.author;
            req.book.isread = req.body.isread;
            req.book.read = req.body.read;
            req.book.save(function(err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(200).json(req.book);
                }
            });
        })
        .patch(function(req, res) {
            // If Id is sent as part of update JSON, delete it
            // We never updated ids
            if (req.body._id)
                delete req.body._id;
            for (var p in req.body) {
                req.book[p] = req.body[p];
            }
            req.book.save(function(err) {
                if (err)
                    res.status(500).send(err);
                else {
                    res.status(200).json(req.book);
                }
            });
        })
        .delete(function(req, res) {
            req.book.remove(function(err){
                if (err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(204).send('Book removed');
                }
            });
        })
        ;
    return bookrouter;
};

module.exports = routes;