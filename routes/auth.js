const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

router.post('/',[
    body('name', 'Enter Your Name Correctly').isLength({ min: 3 }),
    body('email', 'Enter Your email Correctly').isEmail(),
    body('password', 'Enter Your email Correctly').isLength({ min: 5 })
], (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

})
module.exports = router