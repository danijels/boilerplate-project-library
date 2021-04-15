const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Book = require('../models/book');
const Comment = require('../models/comment');
chai.use(chaiHttp);

const requester = chai.request(server).keepOpen();

const bookAssertions = (book) => {
	assert.property(book, 'title', 'The response should have a title prop.');
	assert.property(book, 'author', 'The response should have an author prop.');
	assert.property(book, '_id', 'The response should have an id prop.');
	assert.property(book, 'commentcount', 'The response should have a commentcount prop.');
};

const commentAssertions = (comment) => {
	assert.property(comment, 'content', 'Each comment should have a content prop.');
    assert.property(comment, '_id', 'Each comment should have _id prop.');
    assert.property(comment, 'date', 'Each comment should have a date prop.');
};

suite('/api/books DELETE', () => {
    test('Deleting the entire library', () => {    
      return requester
      .delete('/api/books')
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body, 'success', 'The response from deleting should be "success".');        
      });
    });
  });//suite /api/books DELETE

suite('/api/books GET, empty', () => {
	test('Getting a response when the library is empty', () => {
		return requester
		.get('/api/books')
		.then(res => {
			assert.equal(res.status, 200);
	        assert.isArray(res.body, 'The response should be an array.')
	        assert.lengthOf(res.body, 0, 'The response array should be empty');
		});
	});
});//suite /api/books GET, empty

suite('/api/books POST', () => {
	test('Adding books w/ title and w/ author', () => {
		const title = 'book';
		const author = 'some guy';
		return Promise.all([
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author }),
			requester.post('/api/books').send({ title, author })
		])
		.then(args => {
			args.forEach(res => {
				assert.equal(res.status, 200);
				assert.equal(res.body.title, title, 'There should be a title prop with val equal to the sent title.');
				assert.equal(res.body.author, author, 'There should be an author prop with val equal to the sent author.');
				assert.property(res.body, '_id', 'There should be an _id prop.');
			});
		});
    });

    test('Adding a new book w/ title and w/o author', () => {
        const title = 'new book';

        return requester
        .post('/api/books')
        .send({ title })
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, title, 'There should be a title prop with val equal to the sent title.');
            assert.equal(res.body.author, 'NN', 'There should be an author prop with val of NN');
            assert.property(res.body, '_id', 'There should be an _id prop.');
        });
    });

    test('Adding a new books w/o title', () => {
		const title = 'new book';

		return requester
		.post('/api/books')
		.send({})
		.then(res => {
			assert.equal(res.status, 200);
			assert.equal(res.body.error, 'Missing required field title.');
		});
    });
});//suite /api/books POST

suite('/api/books/count GET', () => {
      test('Getting the book count', () => {
          return requester
          .get('/api/books/count')
          .then(res => {
              assert.equal(res.status, 200);
              assert.equal(res.body, 11, 'The previous tests posted 11 books.');
          });
      });
});//suite /api/books/count GET

suite('/api/books GET, populated', () => {
	test('Getting a response when the library is populated', () => {
		return requester
		.get('/api/books')
		.then(res => {
			assert.equal(res.status, 200);
			assert.equal(res.body.length, 10, 'Only the first ten books should be retrieved.');

			res.body.forEach(bookAssertions);
		});
	});
});//suite /api/books GET, populated

suite('/api/books/prev', () => {
    test('Getting the previous page', async () => {
        const books = await requester.get('/api/books');
        const lastId = books.body[books.body.length - 1]._id;

        return requester
        .get(`/api/books/prev/${lastId}`)      
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 1, 'There\'s 1 book on the prev page.');

            res.body.forEach(bookAssertions);

            const ids = res.body.map(book => book._id);
            assert.notInclude(ids, lastId, 'The last book from the previous page should not be included in the response.');
      	});
    });

    test('Getting the previous page with a non-existing id', () => {
        return requester.get(`/api/books/prev/gibberish`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the previous page.`);
        });
    });
});//suite /api/books/prev

suite('/api/books/next', () => {
    test('Getting the next page', async () => {
        const books = await requester.get('/api/books');
        const lastId = books.body[books.body.length - 1]._id;

        const prevPage = await requester.get(`/api/books/prev/${lastId}`);
        const firstId = prevPage.body[0]._id;

        requester.get(`/api/books/next/${firstId}`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 10, 'There\'s 10 books on this page.');

            res.body.forEach(bookAssertions);

            const ids = res.body.map(book => book._id);
            assert.notInclude(ids, firstId, 'The first book from the previous page should not be included in the response.');
      	});
    });

    test('Getting the next page with a non-existing id', () => {
        return requester.get(`/api/books/next/gibberish`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the next page.`);
        });
    });
});//suite '/api/books/next'

suite('/api/books/:id GET, comments empty', async () => {
    test('Getting an existing book', () => {
        return requester
        .get('/api/books')
        .then(res => requester.get(`/api/books/${res.body[0]._id}`))      
        .then(res => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'The response should have a title prop.');
			assert.property(res.body, 'author', 'The response should have an author prop.');
			assert.property(res.body, '_id', 'The response should have an id prop.');
			assert.equal(res.body.comments.length, 0, 'The comments array should be empty.')
            assert.equal(res.body.commentcount, 0, 'The commentcount should be 0.');       
        });
    });

    test('Getting a non-existing book', () => {
        return requester
        .get('/api/books/gibberish')
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't find this book.`);
        });
    });
});//suite /api/books/:id GET, comments empty

suite('/api/books/:id POST', () => {
    test('Posting a comment for an existing book', () => {
        return requester
        .get('/api/books')
        .then(res => {
            const id = res.body[0]._id;
            return Promise.all([
              requester.post(`/api/books/${id}`).send({ "comment": "a comment" }),
              requester.post(`/api/books/${id}`).send({ "comment": "a comment" }),
              requester.post(`/api/books/${id}`).send({ "comment": "a comment" }),
              requester.post(`/api/books/${id}`).send({ "comment": "a comment" }),
              requester.post(`/api/books/${id}`).send({ "comment": "a comment" }),
              requester.post(`/api/books/${id}`).send({ "comment": "a comment" })
            ]);
        })      
        .then(args => {
        	assert.equal(args.length, 6);
            args.forEach(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'success', 'The response should be "success"');
            });
        });
    });

   test('Posting a comment w/o content', () => {
        return requester
        .get('/api/books')
        .then(res => requester.post(`/api/books/${res.body[0]._id}`).send({}))
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Missing required field comment.`);
        });
    });

    test('Posting a comment for a non-existing book', () => {
        return requester
        .post('/api/books/gibberish')
        .send({ 'comment': 'i dont matter' })
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't save the comment.`)
        });
    });
});//suite /api/books/:id POST

suite('/api/books/:id GET, comments populated', () => {
    test('Getting an existing book', () => {
        return requester
        .get('/api/books')
        .then(res => requester.get(`/api/books/${res.body[0]._id}`))      
        .then(res => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title', 'The response should have a title prop.');
			assert.property(res.body, 'author', 'The response should have an author prop.');
			assert.property(res.body, '_id', 'The response should have an id prop.');
			assert.property(res.body, 'comments', 'The response should have a comments prop.');
            assert.equal(res.body.commentcount, 6, 'Previous tests posted 6 comments.'); 
        });
    });
});//suite /api/books/:id GET, comments populated

suite('/api/books/:id/comments GET', () => {
    test('Getting comments for an existing book', () => {
        return requester
        .get('/api/books')
        .then(res => requester.get(`/api/books/${res.body[0]._id}/comments`))
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.length, 5, 'Only the first 5 comments should be retireved.');

            res.body.forEach(commentAssertions);
        });
    });

    test('Getting comments for a non-existing book', () => {
        return requester
        .get('/api/books/gibberish/comments')
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the comments.`);
        });
    });
});//suite /api/books/:id/comments GET

suite('/api/books/:id/comments/prev/:from', () => {
    test('Getting the previous page for existing ids', async () => {
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id;

        const lastBook = await requester.get(`/api/books/${bookid}`);
        const lastId = lastBook.body.comments[lastBook.body.commentcount - 1];

        return requester
        .get(`/api/books/${bookid}/comments/prev/${lastId}`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.isAtMost(res.body.length, 5);

            res.body.forEach(commentAssertions);

            const ids = res.body.map(comment => comment._id);
            assert.notInclude(ids, lastId);
     	});
    });

    test('A non-existing book', () => {
        return requester
        .get(`/api/books/gibberish/comments/prev/itshouldnotgethere`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the previous page.`);
        });
    });

    test('A non-existing from id', async () => {
        return requester
        .get('/api/books')
        .then(res => requester.get(`/api/books/${res.body[0]._id}/comments/prev/gibberish`))        
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the previous page.`);
        });
    });
});//suite /api/books/:id/comments/prev/:from

suite('/api/books/:id/comments/next/:from', () => {
    test('Getting the next comment page', async () => {
		const books = await requester.get('/api/books');
		const bookid = books.body[0]._id;

		const book = await requester.get(`/api/books/${bookid}`);
		const lastId = book.body.comments[book.body.comments.length - 1];

		const prevPage = await requester.get(`/api/books/${bookid}/comments/prev/${lastId}`);
		const firstId = prevPage.body[0]._id;

		return requester
		.get(`/api/books/${bookid}/comments/next/${firstId}`)
		.then(res => {
			assert.equal(res.status, 200);
			assert.isAtMost(res.body.length, 5);

			res.body.forEach(commentAssertions);

			const ids = res.body.map(comment => comment._id);
			assert.notInclude(ids, firstId);
			assert.include(ids, lastId);        
		});
	});

    test('A non-existing book id', () => {
		return requester
		.get(`/api/books/gibberish/comments/next/gibberish`)
		.then(res => {
			assert.equal(res.status, 200);
			assert.equal(res.body.error, `Couldn't get the next page.`);    
		});
    });

    test('A non-existing from id', () => {
    	return requester
		.get('/api/books')
		.then(res => requester.get(`/api/books/${res.body[0]._id}/comments/next/gibberish`))
		.then(res => {
			assert.equal(res.status, 200);
			assert.equal(res.body.error, `Couldn't get the next page.`);    
		});
    });
});//suite /api/books/:id/comments/next/:from

suite('/api/books/:id/comments/:commentid', () => {
    test('Deleting an existing comment', async () => {
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id;

        const book = await requester.get(`/api/books/${bookid}`);
        const commentid = book.body.comments[0];

        return requester
        .delete(`/api/books/${bookid}/comments/${commentid}`)
        .then(res => Promise.all([
            requester.get(`/api/books/${bookid}`),
            requester.get(`/api/books/${bookid}/comments`)
        ]))
        .then(([book, comments]) => {
            assert.equal(book.status, 200);
            assert.equal(comments.status, 200);

            const idsInBook = book.body.comments.map(comment => comment._id);
            assert.notInclude(idsInBook, commentid);

            const idsInArray = comments.body.map(comment => comment._id);
            assert.notInclude(idsInArray, commentid);
        })
    });

    test('Deleting a non-existing comment', async () => {
    	return requester
        .get('/api/books')
        .then(res => requester.delete(`/api/books/${res.body[0]._id}/comments/gibberish`))
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't delete the comment.`)
        });
    });

    test('Deleting from a non-existing book', () => {
        return requester
        .delete(`/api/books/gibberish/comments/gibberish`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't delete the comment.`)
        });
    });
});//suite /api/books/:id/comments/:commentid

suite('/api/books/:id/comments DELETE', () => {
    test('Deleting comments of an existing book', async () => {
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id;

        return requester
        .delete(`/api/books/${bookid}/comments/`)
        .then(res => Promise.all([
            requester.get(`/api/books/${bookid}`),
            requester.get(`/api/books/${bookid}/comments`)
        ]))
        .then(([book, comments]) => {
            assert.equal(book.status, 200);
            assert.equal(comments.status, 200);

            assert.equal(book.body.comments.length, 0);

            assert.equal(comments.body.length, 0);
        });
    });

    test('Deleting comments for a non-existing book', () => {
        return requester
        .delete('/api/books/gibberish/comments')
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't delete the comments.`);
            //requester.close();
        });
    });
});//suite /api/books/:id/comments DELETE  

suite('/api/books/:id DELETE', () => {
    test('Deleting an existing book', async () => {
        return requester
        .get('/api/books')
        .then(res => requester.delete(`/api/books/${res.body[0]._id}`))
        .then(async res => {
            const countRes = await requester.get('/api/books/count');
            const count = countRes.body;

            assert.equal(res.status, 200);
            assert.equal(res.body, 'success', 'The response should equal to "success".');
            assert.equal(count, 10, 'There should be 10 books now.');
        });
    });

    test('Deleting a non-existing book', () => {
        return requester
        .delete('/api/books/gibberish')
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't delete this book.`);
        });
    });

    test('Checking if deleting the book deletes all its comments', async () => {
    	const books = await requester.get('/api/books');
    	const bookid = books.body[0]._id;

    	return requester
    	.delete(`/api/books/${bookid}`)
    	.then(res => requester.get(`/api/books/${bookid}/comments`))
    	.then(res => {
    		assert.equal(res.status, 200);
    		assert.isArray(res.body);
    		assert.equal(res.body.length, 0);
    		requester.close();
    	});
    });
});//suite /api/books/:id DELETE
