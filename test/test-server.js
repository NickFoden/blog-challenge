const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function(){
	before(function(){
		return runServer();
	});
	after(function(){
		return closeServer();
	});

	it('should list blog posts on GET', function(){
		return chai.request(app)
		.get('/blog-challenge')
		.then(function(res){
			res.should.have.status(200);
			res.should.be.json;
			res.body.should.be.a('array');
				res.body.length.should.be.at.least(1);
				const expectedKeys = ['title', 'content', 'author'];
				res.body.forEach(function(item){
					item.should.be.a('object');
					item.should.include.keys(expectedKeys);

				});
		});
	});
});