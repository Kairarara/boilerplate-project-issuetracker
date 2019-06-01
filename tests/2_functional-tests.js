/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/tests')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          let obj={
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
            assigned_to: 'Chai and Mocha',
            status_text: 'In QA'
          }
          
          assert.property(res.body, 'issue_title');
          assert.property(res.body, 'issue_text');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.property(res.body, 'created_by');
          assert.property(res.body, 'assigned_to');
          assert.property(res.body, 'open');
          assert.property(res.body, 'status_text');
          assert.property(res.body, '_id');
         
          assert.equal(res.body.issue_title, obj.issue_title);
          assert.equal(res.body.issue_text, obj.issue_text);
          assert.equal(res.body.created_by, obj.created_by);
          assert.equal(res.body.assigned_to, obj.assigned_to);
          assert.equal(res.body.status_text, obj.status_text);
          assert.exist(res.body.created_on);
          assert.exist(res.body.updated_on);
          assert.exist(res.body.open);
          //fill me in too!
        });
        done();
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/tests')
          .send({
            issue_title: 'Title',
            issue_text: 'text',
            created_by: 'Functional Test - Every field filled in',
          })
          .end((err,res)=>{
            assert.equal(res.status, 200);
          
            assert.property(res.body, 'issue_title');
            assert.property(res.body, 'issue_text');
            assert.property(res.body, 'created_on');
            assert.property(res.body, 'updated_on');
            assert.property(res.body, 'created_by');
            assert.property(res.body, 'assigned_to');
            assert.property(res.body, 'open');
            assert.property(res.body, 'status_text');
            assert.property(res.body, '_id');
          
            assert.equal(res.body.issue_title, "Title");
            assert.equal(res.body.issue_text, "text");
            assert.equal(res.body.created_by, "Functional Test - Every field filled in");
            assert.equal(res.body.assigned_to, "");
            assert.equal(res.body.status_text, "");
            assert.exist(res.body.created_on);
            assert.exist(res.body.updated_on);
            assert.exist(res.body.open);
          })
        done();
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('api/issues/tests')
          .send({
            issue_title: "Title"
        })
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.text,"missing required parameter")
          })
        done();
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
          .put("api/issues/tests")
          .send({})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.text,"no updated field sent")
        })
        done();
      });
      
      test('One field to update', function(done) {
        chai.request(server)
          .put("api/issues/tests")
          .send({issue_text: "banana bonanza"})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.text,"successfully updated")
        })
        done();
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put("api/issues/tests")
          .send({issue_text: "banana bonanza",
                issue_title: "apples and"})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.text,"successfully updated")
        })
        done();
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/tests')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
        });
        done();
      });
      
      test('One filter', function(done) {
        chai.request(server)
        .get('/api/issues/tests')
        .query({issue_text: "One filter"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          for(let i=0;i<res.body.length;i++){
            assert.equal(res.body[i].issue_text, 'One filter');
          }
        });
        done();
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
        .get('/api/issues/tests')
        .query({issue_title:"Multiple",
               issue_text:"filters"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          for(let i=0;i<res.body.length;i++){
            assert.equal(res.body[i].issue_title, 'Multiple');
            assert.equal(res.body[i].issue_text, 'filters');
          }
        });
        done();
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/tests')
          .send({})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.text,"_id error")
        })
        done();
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
          .delete('/api/issues/tests')
          .send({_id:"5cf00a43a62fe45bb2641989"})
          .end((err,res)=>{
            assert.equal(res.status, 200);
            assert.equal(res.text,"deleted 5cf00a43a62fe45bb2641989")
        })
        done();
      });
      
    });

});

      test('No body', function(done) {
        
      });
      
      test('One field to update', function(done) {
        
      });
      
      test('Multiple fields to update', function(done) {
        
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        
      });
      
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        
      });
      
      test('Valid _id', function(done) {
        
      });
      
    });

});
