const express = require('express');
const router = express.Router();
const Book = require('../models/Book')
const { body, validationResult } = require('express-validator');
const userdata = require('../middleware/userdata') // Import custom middleware for user authentication.

//ROUTE 1 : get all books using get"/books".login required
router.get('/books', userdata, async (req, res) => {
    const book = await Book.find({ user: req.user.id })
    res.json(book);
})


//ROUTE 2 : add a new books using post"/addbooks".login required
router.post('/addbooks', userdata, [//below are the check we use for validating the data 
    // Validation checks for the request body fields using express-validator.
    body('title', 'Enter Your title Correctly').isLength({ min: 3 }),
    body('description', 'Enter Your description Correctly').isLength({ min: 5 })], async (req, res) => {
        try {
            const { title, description, link, tag } = req.body;
            // Validate the request body against the defined checks.
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                // If there are validation errors, return a 400 Bad Request response with the errors.
                return res.status(400).json({ errors: errors.array() });
            }
            const books = await Book.create({
                title,
                description,
                link,
                tag,
                user: req.user.id
            })
            res.json(books);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("There is some Internal Server Error")
        }
    })

//ROUTE 3 : update an existing book using put"/updatebook".login required
//for updation we use 'put'
router.put('/updatebook/:id', userdata, async (req, res) => {
    try {
        const { title, description, link, tag } = req.body;
        //creating an updatebook object
        const updateBook = {};
        if (title) {
            updateBook.title = title;
        };
        if (description) {
            updateBook.description = description;
        };
        if (link) {
            updateBook.link = link;
        };
        if (title) {
            updateBook.tag = tag;
        };

        // first we will find and check the book in database to be updated and update it
        let book = await Book.findById(req.params.id);

        // if it is not there then 404 status will be send with not found message
        if (!book) { return res.status(404).send("Not Found") };
        //to check book which is edited by the user is there's or not if it's not there's then status 401 is send with not allowed message
        if (book.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        // now we will update the book after all checks of owner of book i.e., user
        book = await Book.findByIdAndUpdate(req.params.id, { $set: updateBook }, { new: true })
        res.json(book);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("There is some Internal Server Error")
    }

})

//ROUTE 4 : delete an existing book using delete"/updatebook".login required
//for updation we use 'put'
router.delete('/deletebook/:id', userdata, async (req, res) => {

    try {
        // first we will find and check the book in database to be delete it
        let book = await Book.findById(req.params.id);

        // if it is not there then 404 status will be send with not found message
        if (!book) { return res.status(404).send("Not Found") };

        //to check book which is edited by the user is there's or not if it's not there's then status 401 is send with not allowed message
        // allow deletion only if user owns this book and account 
        if (book.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }

        //deleting the book
        book = await Book.findByIdAndDelete(req.params.id)
        res.json({ "success": "book has been deleted", book: book });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("There is some Internal Server Error")
    }

})


module.exports = router