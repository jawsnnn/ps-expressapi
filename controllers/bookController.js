// This controller file will isolate all get and post functions to make it easier
// to unit test?

var bookController = function (Book) {
    var post = function (req, res) {
        var book = new Book(req.body);
        if (!req.body.title) {
            res.status(400);
            res.send("Title is required");
        }
        else {
            book.save(function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("Saved in DB");
                }
            });
            res.status(201);
            res.send(book);
        }                
    };

    var get = function (req, res) {
        // Get query from url
        var query = req.query;
        // Validate query parameter
        if (req.query.genre) {
            query.genre = req.query.genre;
        }
        // find books in db
        Book.find(query, (err, books) => {
            if (err) {
                // Send error 
                res.status(500);
                res.send(err);
            }
            else {
                // Send books from db formatted as json
                // HATEOAS implementation
                var bookArray = [];
                books.forEach(element => {
                    // Convert mongo object to JSON
                    var newBook = element.toJSON();
                    // Add link to JSON object
                    newBook.links = {};
                    newBook.links.self = "http://" + req.headers.host + "/api/books/" + newBook._id;
                    bookArray.push(newBook);
                });
                res.json(bookArray);
            }
        });
    };

    return {
        post: post,
        get: get
    }
}

module.exports = bookController;