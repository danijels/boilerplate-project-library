'use strict';
const Book = require('../models/book');
const Comment = require('../models/comment');

//GET controllers
exports.get_comments = (req, res) => {
  const id = req.params.id;

  Comment.find({ 'book' : id })
  .sort('-_id')
  .limit(5)
  .then(docs => res.json(docs))
  .catch(err => res.json({ 'error': `Couldn't get the comments.` }));
}

//POST controllers
exports.post_comment = (req, res) => {
  const bookid = req.params.id;
  const commentText = req.body.comment;
  if (!commentText) return res.json({ 'error': 'Missing required field comment.' });

  const comment = new Comment({
    content: commentText,
    book: bookid
  });

  const promises = [comment.save(), Book.findById(bookid)];
      
  Promise.all(promises)       
  .then(([com, book]) => {
    return book.updateOne({ $addToSet: { comments: com._id } });
  })
  .then(book => res.json('success'))
  .catch(err => res.json({ 'error': `Couldn't save the comment.` }));
}

//DELETE controllers
exports.delete_all_comments = async (req, res) => {
  const id = req.params.id;

  const promises = [Comment.deleteMany({ 'book': id }), Book.findById(id)];
  
  Promise.all(promises)
  .then(([com, book]) => {
    if (!book) throw new Error;
    book.comments = [];
    return book.save();
  })
  .then(book => res.json('success'))
  .catch(err => res.json({ 'error': `Couldn't delete the comments.` }));
}

exports.delete_comment = (req, res) => {  
  const bookId = req.params.bookid;
  const commentId = req.params.id;

  const promises = [Comment.findByIdAndDelete(commentId), Book.findById(bookId)];
  
  Promise.all(promises)
  .then(([com, book]) => {
    const comments = [...book.comments];
    const indexToDelete = comments.indexOf(commentId);
    comments.splice(commentId, 1);
    book.comments = comments;

    return book.save()
  })
  .then(book => res.json('success'))
  .catch(err => res.json({ 'error': `Couldn't delete the comment.` }));  
}

// Pagination controllers
exports.next_comments = (req, res) => {
  const id = req.params.id;
  const fr = req.params.from;
  
  Comment.find({ _id: {$gt: fr}, 'book': id })  
  .limit(5)
  .then(data => res.json(data.reverse())) 
  .catch(err => res.json({ 'error': `Couldn't get the next page.` }));
}

exports.prev_comments = (req, res) => {
  const id = req.params.id;
  const fr = req.params.from;

  Comment.find({ _id: {$lt: fr}, 'book': id })
  .sort('-_id')
  .limit(5)
  .then(data => res.json(data))
  .catch(err => res.json({ 'error': `Couldn't get the previous page.` }));
}
