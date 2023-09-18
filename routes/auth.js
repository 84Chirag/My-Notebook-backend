const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const JWT_SECRET = "chirag-gour"

//save the data in db like normally you use 'use()'
/*
router.post('/', (req, res)=>{
    console.log(req.body)
    const user = User(req.body)
    User.save();
    res.send(req.body)

})
*/

//but here we are validating the data which we will post to us by user so that our app don't get crashed 
//and we will use 'save()' instead we save by using this below syntax cause we are using express-validator
router.post('/', [//below are the check we use for validating the data // Validation checks for the request body fields using express-validator.
  body('name', 'Enter Your Name Correctly').isLength({ min: 3 }),
  body('email', 'Enter Your email Correctly').isEmail(),
  body('password', 'Enter Your password Correctly').isLength({ min: 5 })
], async (req, res) => {
  // Validate the request body against the defined checks.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the errors.
    return res.status(400).json({ errors: errors.array() });
  }
  try {

    let user = await User.findOne({ email: req.body.email })
    // If the request data is valid, create a new User instance and save it to the database using User.create().
    if (user) {
      return res.status(400).json({ error: "A User With this Account Already Exists" })
    }
    // adding salt from bcrypt with hash passwrd
    const salt = await bcrypt.genSalt(10)
    // hashing password with salt and passing it to database
    const securepassword = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: securepassword,
    });
    // Craeting a JSON response of user database indexes id named data. 
    //used to check back when when token is returned by user
    const data = {
      user:{
        id : user.id
      }
    }
    //assigning authenticationtoken both data and JWT_SECRET and sending it to user as response
    //JWT_SECRET is used to check if anyone has temper with the token when user send the token back
    const authenticationtoken = jwt.sign(data, JWT_SECRET)
    console.log(authenticationtoken)
    //so here we are sending authenticationtoken which is user's database index id with my signature to user as authentication token which will set it in it's local storage to keep him logged in until he log out himself
    res.send(authenticationtoken)
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("There is some Internal Server Error")
  }
  /*
  // Explanation of why User.save() cannot be used here:
  // User.save() is used to update an existing user document, not for creating new documents.
  // In this code, we are creating a new user document, so User.create() is used instead.
  */
})

module.exports = router