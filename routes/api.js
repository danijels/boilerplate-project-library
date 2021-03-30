'use strict';
const Book = require('../models/book');
const Comment = require('../models/comment');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      Book.find({}, (err, books) => {
        if (err) return res.json(err);

        const result = books.map(book => ({ 
          title: book.title, 
          author: book.author,
          _id: book._id,
          commentcount: book.comments.length 
        }));
        res.send(result);
      })
    })
    
    .post(function (req, res) {  
      const title = req.body.title;
      const author = req.body.author ? req.body.author : 'NN';

      if(!title) return res.json('required field missing');
      
      const book = new Book({ 
        title, 
        author
      });

      book.save((err, doc) => {
        if (err) return res.json(err);
        res.json({
          'title': doc.title,
          'author': doc.author,
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
      
      Book.findById(bookid)
      .then(book => book.populate('comments').execPopulate())
      .then(book => {
        if (!book) return res.json('no book exists');
        res.json({
          'title': book.title,
          'author': book.author,
          '_id': book._id,
          'comments': book.comments
        })
      })
      .catch(err => res.json('no book exists'))
    })
    
    .post(function (req, res) {
      const bookid = req.params.id;
      const commentText = req.body.comment;

      if (!commentText) return res.json('missing required field comment');
      
      const comment = new Comment({
        content: commentText
      });

      comment.save((err, doc) => {
        if (err) return res.json(err);        

        Book.findById(bookid)        
        .then(book => {
          if (!book) throw new Error;
          const comments = [...book.comments];
          comments.unshift(doc._id);
          book.comments = comments; 
          return book.save();
        })
        .then(book => book.populate('comments').execPopulate())
        .then(book => res.json({
          'title': book.title,
          'author': book.author,
          '_id': book._id,
          'comments': book.comments
        }))
        .catch(err => res.json('Sorry, there was a problem.'))
      });
    })
    
    .delete(function(req, res) {
      const bookid = req.params.id;
      
      Book.findByIdAndDelete(bookid, (err, doc) => {
        if (err || !doc) return res.json('no book exists');
        res.json('delete successful');
      })
    });


  app.route('/api/books/:id/comments')
    .delete((req, res) => {
      const id = req.params.id;

      Book.findById(id)
      .then(book => {
        if (!book) throw new Error;
        book.comments = [];
        return book.save();
      })
      .then(book => res.json('successful'))
      .catch(err => res.json('failed'))
    });


  app.route('/api/books/:bookid/comments/:id')
    .delete(function(req, res) {
      const bookId = req.params.bookid;
      const commentId = req.params.id;

      Comment.findByIdAndDelete(commentId, (err, doc) => {
        if (err || !doc) return res.json('failed');
      });

      Book.findById(bookId)
      .then(book => {
        const comments = [...book.comments];
        const indexToDelete = comments.indexOf(commentId);
        comments.splice(commentId, 1);
        book.comments = comments;

        return book.save()
      })
      .then(book => res.json('sucessful'))
      .catch(err => res.json('An error occured during removing the comment.'))
    });
};
