const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const userdata = require('../middleware/userdata') // Import custom middleware for user authentication.

const JWT_SECRET = "chirag-gour" // Replace with a secure secret key in production

// Creating an Express Router instance.
// This allows us to define routes for our API.

/*
router.post('/', (req, res)=>{
  console.log(req.body)
  const user = User(req.body)
  //save the data in db like normally you use 'use()'
  User.save();
  res.send(req.body)
  // Explanation of why User.save() cannot be used here:
  // User.save() is used to update an existing user document, not for creating new documents.
  // In this code, we are creating a new user document, so User.create() is used instead.  
  })
*/


//ROUTE 1 :Creating a user signing up Route for a user using post"/signup". no login required
//but here we are validating the data which we will post to us by user so that our app don't get crashed 
//and we will use 'save()' instead we save by using this below syntax cause we are using express-validator
router.post('/signup', [//below are the check we use for validating the data 
  // Validation checks for the request body fields using express-validator.
  body('name', 'Enter Your Name Correctly').isLength({ min: 3 }),
  body('email', 'Enter Your email Correctly').isEmail(),
  body('password', 'Enter Your password Correctly').isLength({ min: 5 })
], async (req, res) => {
  let success = false;
  // Validate the request body against the defined checks.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // If there are validation errors, return a 400 Bad Request response with the errors.
    return res.status(400).json({success, errors: errors.array() });
  }
  try {

    let user = await User.findOne({ email: req.body.email })
    // If the request data is valid, create a new User instance and save it to the database using User.create().
    if (user) {
      return res.status(400).json({success, error: "A User With this Account Already Exists" })
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
      user: {
        id: user.id
      }
    }

    //assigning authenticationtoken both data and JWT_SECRET and sending it to user as response
    //JWT_SECRET is used to check if anyone has temper with the token when user send the token back
    const authenticationtoken = jwt.sign(data, JWT_SECRET)
    // console.log(authenticationtoken)
    //so here we are sending authenticationtoken which is user's database index id with my signature to user as authentication token which will set it in it's local storage to keep him logged in until he log out himself
    success = true;
    res.json({ success, authenticationtoken})
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send("There is some Internal Server Error")
  }
})



//ROUTE 2 : authenticating a user Route for loging in a user using post"/login". no login required
router.post('/login', [//below are the check we use for validating the data // Validation checks for the request body fields using express-validator.
  body('email', 'Enter Your email Correctly').isEmail(),
  body('password', 'Pasword cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return a 400 Bad Request response with the errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //if there is any error send bad request and error
    return res.status(400).json({ errors: errors.array() });
  }
  // using javascript's destructuring to take email and password from body
  const { email, password } = req.body;
  try {
    // finding the email in database and giving it to user variable
    const user = await User.findOne({ email });
    // if there is no email in database then sending error
    if (!user) {
      return res.status(400).json("there is no email")
    }
    // comparing the password with database's password
    const passwordmatch = await bcrypt.compare(password, user.password);
    // if password doesn't match sending error
    if (!passwordmatch) {
      return res.status(400).json({success, error: "please enter correct password" });
    }
    //assigning data, user, id of database id
    const data = {
      user: {
        id: user.id
      }
    }

    //assigning authenticationtoken both data and JWT_SECRET and sending it to user as response
    //JWT_SECRET is used to check if anyone has temper with the token when user send the token back
    const authenticationtoken = jwt.sign(data, JWT_SECRET)
    // console.log(authenticationtoken)
    success = true;
    //so here we are sending authenticationtoken which is user's database index id with my signature to user as authentication token which will set it in it's local storage to keep him logged in until he log out himself
    res.json({success, authenticationtoken})
  }
  catch (error) {
    // sending error if there any error in server as internal error
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

//ROUTE 3 : Route for getting data of loggedin user, using post"/getuser".login required
router.post('/getuser', userdata, async (req, res) => {
  try {
    // retreiving the authenticated user's data
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    // Send the user data (excluding the password) to the authenticated user.
    res.json({ user });
  } catch (error) {
    // Send an internal server error if there's an issue on the server.
    console.log(error)
    res.status(500).send("Internal Server Error")
  }
})

// Export the router so it can be used in other parts of the application.
module.exports = router