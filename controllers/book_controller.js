'use strict';
const Book = require('../models/book');
const Comment = require('../models/comment');

const bookLimit = 9;

//GET controllers
exports.get_books = (req, res) => {
	return Book.find()
	.sort('-_id')
	.limit(bookLimit)
	.then(data => {
		const result = data.map(book => ({ 
		  title: book.title, 
		  author: book.author,
		  _id: book._id,
      commentcount: book.comments.length
		}));
    res.json(result)
	})
	.catch(err => res.json({ 'error': `Couldn't get the books.` }));
}

exports.get_book = (req, res) => {
  const bookid = req.params.id;

  Book
  .findById(bookid)
  .then(book => {
    if (!book) return res.json({ 'error': `Couldn't find this book.` });
  
    res.json({
      'title': book.title,
      'author': book.author,
      '_id': book._id,
      'comments': book.comments,
      'commentcount': book.comments.length
    })
  })
  .catch(err => res.json({ 'error': `Couldn't find this book.` }));
}

exports.get_books_count = (req, res) => {
  return Book
  .countDocuments()
  .then(num => res.json(num))
  .catch(err => res.json({ 'error': `Couldn't find the book count.` }));
}

//POST controllers
exports.post_books = (req, res) => {
  const title = req.body.title;
  if(!title) return res.json({ 'error': 'Missing required field title.'});
  const author = req.body.author ? req.body.author : 'NN';

	const book = new Book({ 
    title, 
    author,
    'comments': []
  });

  book
  .save()
  .then(doc => {
    res.json({
      'title': doc.title,
      'author': doc.author,
      '_id': doc._id          
    });
  })
  .catch(err => res.json({ 'error': `Couldn't save this book.` }));
}

// DELETE controllers
exports.delete_all_books = (req, res) => {
  const promises = [Comment.deleteMany({}), Book.deleteMany({})];

	Promise.all(promises)
	.then(([com, book]) => res.json('success'))
	.catch(err => res.json({ 'error': `Couldn't delete the books.` }))
}

exports.delete_book = async (req, res) => {
  const bookid = req.params.id;

  const promises = [Comment.deleteMany({ 'book': bookid}), Book.findByIdAndDelete(bookid)];

  Promise.all(promises)
  .then(([com, book]) => {
    if (!book) return res.json({ 'error': `Couldn't delete this book.` });
    res.json('success');
  })
  .catch(err => res.json({ 'error': `Couldn't delete this book.` }));  
}

//Pagination controllers
exports.next_books = (req, res) => {
  const fr = req.params.from;

	Book
	.find({ _id: {$gt: fr} })  
  .limit(bookLimit)
  .then(data => {
    const result = data.map(book => ({ 
      title: book.title, 
      author: book.author,
      _id: book._id,
      commentcount: book.comments.length 
    }));
    res.json(result.reverse());
  })
    .catch(err => res.json({ 'error': `Couldn't get the next page.` }));
}

exports.prev_books = (req, res) => {
  const fr = req.params.from;

	Book
	.find({ _id: {$lt: fr} })
  .sort('-_id')
  .limit(bookLimit)
  .then(data => {
    const result = data.map(book => ({ 
      title: book.title, 
      author: book.author,
      _id: book._id,
      commentcount: book.comments.length 
    }));
    res.json(result);
  })
  .catch(err => res.json({ 'error': `Couldn't get the previous page.` }));
}
