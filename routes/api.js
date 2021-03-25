'use strict';
const Book = require('../models/book');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if (err) return console.log(err);
        const result = books.map(book => ({ 
          title: book.title, 
          _id: book._id,
          comments: book.comments,
          commentcount: book.comments.length 
        }));
        res.send(result);
      });
    })
    
    .post(function (req, res) {  
      const title = req.body.title;
      if(!title) return res.json('required field missing');
      
      const book = new Book({ 
        title: title
      });

      book.save((err, doc) => {
        if (err) return res.json(err);
        res.json({
          'title': doc.title,
          '_id': doc._id          
        })
      });
      
    })
    
    .delete(function(req, res){
      Book.deleteMany({}, (err) => {
        if (err) return res.json('couldn\'t delete');
        res.json('complete delete successful');
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      const bookid = req.params.id;
      
      Book.findById(bookid, (err, book) => {
        if (!book || err) return res.json('no book exists');
        res.json({
          'title': book.title,
          '_id': book._id,
          'comments': book.comments
        })
      })
    })
    
    .post(function (req, res) {
      const bookid = req.params.id;
      const comment = req.body.comment;

      if (!comment) return res.json('missing required field comment');
      
      Book.findById(bookid)
      .then(doc => {
        if (!doc) throw new Error;
        
        const comments = [...doc.comments];
        doc.comments = comments.concat(comment);

        return doc.save();
      })
      .then(book => res.json({
        'title': book.title,
        '_id': book._id,
        'comments': book.comments
      }))
      .catch(err => {
        res.json('no book exists')
      });
    })
    
    .delete(function(req, res){
      const bookid = req.params.id;
      
      Book.findByIdAndDelete(bookid, (err, doc) => {
        if (err || !doc) return res.json('no book exists');
        res.json('delete successful');
      })
    });
  
};
