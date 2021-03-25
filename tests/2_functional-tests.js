const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
        assert.property(res.body[0], 'title', 'Books in array should contain title');
        assert.property(res.body[0], '_id', 'Books in array should contain _id');
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      const title = 'City of Masks';
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({ title })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.property(res.body, '_id');
          assert.equal(res.body.title, title);
          done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'missing required field title');
          done();
        })
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) => {
          const body = res.body;
          assert.equal(res.status, 200);
          assert.isArray(body);
          if (body.length) {
            body.forEach(book => {
              assert.property(book, '_id');
              assert.property(book, 'title');
              assert.property(book, 'commentcount');
            });
          }
          done();
        })
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
        .get('/api/books/idontexist')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        })
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        chai.request(server)
        .post('/api/books')
        .send({ title: 'some new book' })
        .then(res => {
          const id = res.body._id;

          chai.request(server)
          .get('/api/books/'+id)
          .end((err, res) => {
            const body = res.body;

            assert.equal(res.status, 200);
            assert.equal(body._id, id);
            assert.property(body, 'title');
            assert.isArray(body.comments);
            done();
          })
        })
        .catch(err => { console.error(err) });
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        const comment = 'this is a comment';

        chai.request(server)
        .post('/api/books')
        .send({ title: 'new book' })
        .then(res => {
          const id = res.body._id;

          chai.request(server)
          .post('/api/books/'+id)
          .send({ comment })
          .end((err, res) => {
            const body = res.body;

            assert.equal(res.status, 200);
            assert.equal(body._id, id);
            assert.property(body, 'title');
            assert.include(body.comments, comment);
            done();
          });
        })
        .catch(err => {
          console.error(err)
        });
      });

      test('Test POST /api/books/[id] without comment field', function(done){
        chai.request(server)
        .post('/api/books')
        .send({ title: 'new book no comment'})
        .then(res => {
          const id = res.body._id;

          chai.request(server)
          .post('/api/books/'+id)
          .send({})
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'missing required field comment');
            done();
          });
        })
        .catch(err => {
          console.error(err);
        });
      });

      test('Test POST /api/books/[id] with comment, id not in db', function(done){
        chai.request(server)
        .post('/api/books/idontexist')
        .send({ comment: 'comment'})
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();          
        });
      });
      
    });

    suite('DELETE /api/books/[id] => delete book object id', function() {
      
      test('Test DELETE /api/books/[id] with valid id in db', function(done){
        chai.request(server)
        .post('/api/books')
        .send({ title: 'delete valid id'})
        .then(res => {
          const id = res.body._id;

          chai.request(server)
          .delete('/api/books/'+id)
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'delete successful');
            done();
          });
        })
        .catch(err => {
          console.error(err);
        });
      });

      test('Test DELETE /api/books/[id] with  id not in db', function(done){
        chai.request(server)
        .delete('/api/books/idontexist')
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body, 'no book exists');
          done();
        });
      });

    }); //end suite DELETE
  }); //end suite 'Routing tests'
}); //end suite 'Functional tests'