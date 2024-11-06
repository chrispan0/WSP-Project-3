var express = require('express');
var router = express.Router();
let Book = require('../model/book')
router.get('/',async(req,res,next)=>{
    try{
        const BookList = await Book.find();
        res.render('book',{
            title:'Books',
            BookList:BookList
        })
    }
    catch(err){
        console.error(err)
        res.render('book',{
            error:'Error on Server'})
    }
})
module.exports = router;