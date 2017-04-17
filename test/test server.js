const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const {app, runServer, closeServer} = require('../server');

chai.use(chaiHttp);

describe('Blog Posts', function() {

  before(function() {
    return runServer();
  });

  after(function() {
    return closeServer();
  });

  it('should list items on GET', function(done) {
    chai.request(app)
      .get('/blog-posts')
      .end(function(err, res) {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body.length.should.be.above(0);
        res.body.forEach(function(item) {
          item.should.be.a('object');
          item.should.have.all.keys(
            'id', 'title', 'content', 'author', 'publishDate')
        });
      });
    done();
  });
  
it('should add a blog post on POST', function(done) {
    const newPost = {
      title: 'Lorem ip some',
      content: 'foo foo foo foo',
      author: 'Emma Goldman'
    };
    const expectedKeys = ['id', 'publishDate'].concat(Object.keys(newPost));

    chai.request(app)
      .post('/blog-posts')
      .send(newPost)
      .end(function(err, res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.all.keys(expectedKeys);
        res.body.title.should.equal(newPost.title);
        res.body.content.should.equal(newPost.content);
        res.body.author.should.equal(newPost.author)
      });
      done();
  });

  it('should error if POST missing expected values', function(done) {
    const badRequestData = {};
    chai.request(app)
      .post('/blog-posts')
      .send(badRequestData)
      .end(function(err, res) {
        res.should.have.status(400);
      })
    done();
  });

  it('should update blog posts on PUT', function(done) {

    chai.request(app)
      // first have to get
      .get('/blog-posts')
      .end(function(err, res) {
        const updatedPost = Object.assign(res.body[0], {
          title: 'connect the dots',
          content: 'la la la la la'
        });
        chai.request(app)
          .put(`/blog-posts/${res.body[0].id}`)
          .send(updatedPost)
          .end(function(err, res) {
            res.should.have.status(204);
            res.should.be.json;
          });
      })
      done();
  });

  it('should delete posts on DELETE', function(done) {
    chai.request(app)
      // first have to get
      .get('/blog-posts')
      .end(function(err, res) {
        chai.request(app)
          .delete(`/blog-posts/${res.body[0].id}`)
          .end(function(err, res) {
            res.should.have.status(204);
          });
      })
      done();
  });

});