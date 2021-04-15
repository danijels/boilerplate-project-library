'use strict';
const Book = require('../models/book');
const Comment = require('../models/comment');
const bookController = require("../controllers/book_controller");
const commentController = require("../controllers/comment_controller");

module.exports = function (app) {

    app.route('/api/books')
    .get(bookController.get_books)    
    .post(bookController.post_books)    
    .delete(bookController.delete_all_books);

    app.route('/api/books/count') 
    .get(bookController.get_books_count);

    app.route('/api/books/next/:from')
    .get(bookController.next_books);

    app.route('/api/books/prev/:from')
    .get(bookController.prev_books);  

    app.route('/api/books/:id')
    .get(bookController.get_book)    
    .post(commentController.post_comment)    
    .delete(bookController.delete_book);

    app.route('/api/books/:id/comments')
    .get(commentController.get_comments)
    .delete(commentController.delete_all_comments);

    app.route('/api/books/:id/comments/next/:from')
    .get(commentController.next_comments);

    app.route('/api/books/:id/comments/prev/:from')
    .get(commentController.prev_comments);
      
    app.route('/api/books/:bookid/comments/:id')
    .delete(commentController.delete_comment);
};
