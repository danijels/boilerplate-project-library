/*const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

const Book = require('../models/book');
const Comment = require('../models/comment');
chai.use(chaiHttp);

suite('Api tests', () => {
  const requester = chai.request(server).keepOpen();

  /*suite('/api/books DELETE', () => {
    test('Deleting the entire library', () => {    
      return Promise.all([
        requester.delete('/api/books'), 
        requester.get('/api/books')
      ])
      .then(([deleted, books]) => {
        assert.equal(deleted.status, 200);
        assert.equal(deleted.body, 'success');

        assert.equal(books.status, 200);
        assert.lengthOf(books.body, 0);
      });
    });
  });//suite /api/books DELETE*/
  
  /*suite('/api/books POST', () => {
    test('Adding a new book w/ title and author', () => {
      const title = 'new book';
      const author = 'john doe';

      return requester
      .post('/api/books')
      .send({ title, author })
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.title, title);
        assert.equal(res.body.author, author);
        assert.property(res.body, '_id');
      });
    });

    /*test('Adding a new book w/ title and w/o author', () => {
        const title = 'new book';

        return requester
        .post('/api/books')
        .send({ title })
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.title, title);
            assert.equal(res.body.author, 'NN');
            assert.property(res.body, '_id');
        });
    });

    /*test('Adding a new books w/o title', () => {
      const title = 'new book';

      return requester
      .post('/api/books')
      .send({})
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, 'Missing required field title.');
      });
    });

    /*test('Adding some more books', () => {
      return Promise.all([
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' }),
        requester.post('/api/books').send({ 'title': 'book', 'author': 'some guy' })
      ])
      .then(args => {
        args.forEach(res => {
          assert.equal(res.status, 200);
          assert.property(res.body, 'title');
          assert.property(res.body, 'author');
          assert.property(res.body, '_id');
        })
      });
    });
  });//suite /api/books POST*/

  /*suite('/api/books/count GET', () => {
      test('Getting the book count', () => {
          return requester
          .get('/api/books/count')
          .then(res => {
              assert.equal(res.status, 200);
              assert.equal(res.body, 11);
          });
      });
  }); //suite /api/books/count GET*/

  /*suite('/api/books/ GET', () => {
    test('Getting the books', () => {
      return requester
      .get('/api/books')
      .then(res => {
        assert.equal(res.status, 200);
        assert.isAtMost(res.body.length, 10);

        res.body.forEach(book => {
          assert.property(book, 'title');
          assert.property(book, 'author');
          assert.property(book, '_id');
          assert.property(book, 'commentcount');
        });
      });
    });
  });// suite /api/books GET*/

  /*suite('/api/books/next', () => {
    test('Getting the next page', async () => {
        const books = await requester.get('/api/books');
        const lastId = books.body[books.body.length - 1]._id;

        const prevPage = await requester.get(`/api/books/prev/${lastId}`);
        const firstId = prevPage.body[0]._id;

        requester.get(`/api/books/next/${firstId}`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.isAtMost(res.body.length, 10);

            res.body.forEach(book => {
                assert.property(book, 'title');
                assert.property(book, 'author');
                assert.property(book, '_id');
                assert.property(book, 'commentcount');
            });

            const ids = res.body.map(book => book._id);
            assert.notInclude(ids, firstId);
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

  /*suite('/api/books/prev', () => {
    test('Getting the previous page', async () => {
        const books = await requester.get('/api/books');
        const lastId = books.body[books.body.length - 1]._id;

        return requester
        .get(`/api/books/prev/${lastId}`)      
        .then(res => {
            assert.equal(res.status, 200);
            assert.isAtMost(res.body.length, 10);

            res.body.forEach(book => {
                assert.property(book, 'title');
                assert.property(book, 'author');
                assert.property(book, '_id');
                assert.property(book, 'commentcount');
            });

            const ids = res.body.map(book => book._id);
            assert.notInclude(ids, lastId);
      });
    });

    test('Getting the previous page with a non-existing id', () => {
        return requester.get(`/api/books/prev/gibberish`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the previous page.`);
        });
    });
  });//suite '/api/books/prev'*/

  /*suite('/api/books/:id POST', () => {
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
            args.forEach(res => {
                assert.equal(res.status, 200);
                assert.equal(res.body, 'success');
            });
        });
    });

    test('Posting a comment w/o content', () => {
        return requester
        .get('/api/books')
        .then(res => {
            const id = res.body[0]._id;
            return requester.post(`/api/books/${id}`).send({})
        })
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
  });//suite /api/books/:id POST*/

  /*suite('/api/books/:id GET', async () => {
    test('Getting an existing book', () => {
        return requester
        .get('/api/books')
        .then(res => requester.get(`/api/books/${res.body[0]._id}`))      
        .then(res => {
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, 'author');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments');

            res.body.comments.forEach(comment => {
                assert.property(comment, 'content');
                assert.property(comment, '_id');
            });        
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
});//suite /api/books/:id GET*/

  /*suite('/api/books/:id DELETE', () => {
    test('Deleting an existing book', async () => {
        const book = await requester.post('/api/books').send({ 'title': 'title' });
        const bookId = book.body._id;

        const countRes = await requester.get('/api/books/count');
        const count = countRes.body;

        return requester
        .delete(`/api/books/${bookId}`)
        .then(async res => {
            const newCountRes = await requester.get('/api/books/count');
            const newCount = newCountRes.body;

            assert.equal(res.status, 200);
            assert.equal(res.body, 'success');
            assert.equal(count - 1, newCount);
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
  });//suite /api/books/:id DELETE

  /*suite('/api/books/:id/comments/count', () => {
    test('Get the comment count for an existing book', () => {
      return requester
      .get('/api/books')
      .then(res => requester.get(`/api/books/${res.body[0]._id}/comments/count`))
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body, 6);
      });
    });

    test('Get the comment count for a non-existing book', () => {
      return requester
      .get(`/api/books/gibberish/comments/count`)
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, `Couldn't find the comment count.`);
      });
    });
  });//suite /api/books/:id/comments/count*/

  /*suite('/api/books/:id/comments GET', () => {
    test('Getting comments for an existing book', () => {
        return requester
        .get('/api/books')
        .then(res => requester.get(`/api/books/${res.body[0]._id}/comments`))
        .then(res => {
            assert.equal(res.status, 200);
            assert.isAtMost(res.body.length, 5);

            res.body.forEach(comment => {
                assert.property(comment, 'content');
                assert.property(comment, '_id');
                assert.property(comment, 'date');
            });
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
});//suite /api/books/:id/comments GET*/

  /*suite('/api/books/:id/comments/prev/:from', () => {
    test('Getting the previous page for existing ids', async () => {
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id;

        const lastBook = await requester.get(`/api/books/${bookid}`);
        const lastId = lastBook.body.comments[lastBook.body.comments.length - 1]._id;

        return requester
        .get(`/api/books/${bookid}/comments/prev/${lastId}`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.isAtMost(res.body.length, 5);

            res.body.forEach(comment => {
                assert.property(comment, 'content');
                assert.property(comment, '_id');
                assert.property(comment, 'date');
            });

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
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id

        return requester
        .get(`/api/books/${bookid}/comments/prev/gibberish`)
        .then(res => {
            assert.equal(res.status, 200);
            assert.equal(res.body.error, `Couldn't get the previous page.`);
        });
    });
});//suite /api/books/:id/comments/prev/:from*/

  /*suite('/api/books/:id/comments/next/:from', () => {
      test('Getting the next comment page', async () => {
          const books = await requester.get('/api/books');
          const bookid = books.body[0]._id;

          const book = await requester.get(`/api/books/${bookid}`);
          const lastId = book.body.comments[book.body.comments.length - 1]._id;

          const prevPage = await requester.get(`/api/books/${bookid}/comments/prev/${lastId}`);
          const firstId = prevPage.body[0]._id;

          return requester
          .get(`/api/books/${bookid}/comments/next/${firstId}`)
          .then(res => {
              assert.equal(res.status, 200);
              assert.isAtMost(res.body.length, 5);

              res.body.forEach(comment => {
                  assert.property(comment, 'content');
                  assert.property(comment, '_id');
                  assert.property(comment, 'date');
              });

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

      test('A non-existing from id', async () => {
          const books = await requester.get('/api/books');
          const bookid = books.body[0]._id;

          return requester
          .get(`/api/books/${bookid}/comments/next/gibberish`)
          .then(res => {
              assert.equal(res.status, 200);
              assert.equal(res.body.error, `Couldn't get the next page.`);    
          });
      });
  });*/

  /*suite('/api/books/:id/comments/:commentid', () => {
    test('Deleting an existing comment', async () => {
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id;

        const book = await requester.get(`/api/books/${bookid}`);
        const commentid = book.body.comments[0]._id;

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
        const books = await requester.get('/api/books');
        const bookid = books.body[0]._id;

        return requester
        .delete(`/api/books/${bookid}/comments/gibberish`)
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
    });*/
//*

  /*suite('/api/books/:id/comments DELETE', () => {
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
});//main suite


