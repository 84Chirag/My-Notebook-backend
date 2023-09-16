const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

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
router.post('/',[//below are the check we use for validating the data
  body('name', 'Enter Your Name Correctly').isLength({ min: 3 }),
  body('email', 'Enter Your email Correctly').isEmail(),
  body('password', 'Enter Your email Correctly').isLength({ min: 5 })
], (req, res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  User.save();//you cannot use() here because we will create a new User and save the data in db like below but normally you use should use 'use()'
  res.send(req.body)

})
module.exports = router