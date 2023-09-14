const express = require('express');
const router = express.Router();

router.get('/', (req, res)=>{
    const book = {
        book : "tilte "
    }
    res.json(book);

})
module.exports = router