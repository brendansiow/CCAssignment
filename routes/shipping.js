const express = require("express");
const router = express.Router();
var flash = require("connect-flash");

router.get('/add',(req,res,next)=>{
    res.render('shipping', { layout: "homelayout.hbs" })
})

module.exports = router;
