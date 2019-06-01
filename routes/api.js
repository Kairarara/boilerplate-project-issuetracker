/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});


module.exports = function (app) {

  app.route('/api/issues/:project')
    //I can GET /api/issues/{projectname} for an array of all issues on that specific project with all the information for each issue as was returned when posted.
    //I can filter my get request by also passing along any field and value in the query(ie. /api/issues/{project}?open=false).
    //I can pass along as many fields/values as I want.
    .get(function (req, res){
      var project = req.params.project;
      let query=req.query;
      if(query.hasOwnProperty('_id')) query._id=ObjectId(query._id);
      MongoClient.connect(CONNECTION_STRING,{ useNewUrlParser: true },(err,client)=>{
        if (err) throw err;
        const db=client.db("issues");
        
        if(query.hasOwnProperty("_id")) query._id=query._id;
        if(query.open){
          if(query.open=="true") query.open=true
          else if(query.open=="false") query.open=false
          else console.log("invalid 'open' value")
        }
        
        let collection=db.collection(project).find(query).toArray((err, result)=>{
          if (err) throw err;
          res.json(result);
          client.close();
        })
      });
    })
    
  //I can POST /api/issues/{projectname} with form data containing required issue_title, issue_text, created_by, and optional assigned_to and status_text.
    .post(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING,{ useNewUrlParser: true },(err, client)=>{
        if (err) throw err;
        const db=client.db("issues");
        if(!req.body.issue_title||!req.body.issue_text||!req.body.created_by){
          res.send("missing inputs")
          client.close()
        }
        let obj={
          issue_title: req.body.issue_title,
          issue_text:  req.body.issue_text,
          created_by:  req.body.created_by,
          created_on:  new Date(),
          updated_on:  new Date(),
          open:        true,
          assigned_to: (req.body.assigned_to)?req.body.assigned_to:"",
          status_text: (req.body.status_text)?req.body.status_text:""
        };
        
        if(req.body.hasOwnProperty("_id")) obj._id=req.body._id;
        
        db.collection(project).insertOne(obj,(error,response)=>{
          if(error) {
            console.log('Error occurred while inserting');
          }  else  {
            res.json(response.ops[0]);
          }
          client.close()
        });
      });
    })
  
    //I can PUT /api/issues/{projectname} with a _id and any fields in the object with a value to object said object.
    //Returned will be 'successfully updated' or 'could not update '+_id. This should always update updated_on.
    //If no fields are sent return 'no updated field sent'.
    .put(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING,{ useNewUrlParser: true },(err,client)=>{
        if (err) throw err;
        const db=client.db("issues");
        let id=ObjectId(req.body._id)
        let update=req.body;
        delete req.body._id;
        if(Object.keys(update).size<1){
          res.send("no updated field sent")
        }
        update.updated_on=new Date();
        if(update.open){
          if(update.open=="true") update.open=true
          else if(update.open=="false") update.open=false
          else console.log("invalid 'open' value")
        }
        db.collection(project).updateOne({"_id":id},{$set:update},(err,result)=>{
          if(result.result.ok){
            res.send("successfully updated")
          } else {
            res.send("could not update "+req.body._id)
          }
        })
        client.close();
      });
    })
    
    //I can DELETE /api/issues/{projectname} with a _id to completely delete an issue.
    //If no _id is sent return '_id error', success: 'deleted '+_id, failed: 'could not delete '+_id.
    .delete(function (req, res){
      var project = req.params.project;
      MongoClient.connect(CONNECTION_STRING,{ useNewUrlParser: true },(err,client)=>{
        if (err) throw err;
        const db=client.db("issues")
        let id=req.body._id;
        if(!id){
          res.send("_id error");
        } else {
          db.collection(project).deleteOne({"_id":ObjectId(id)},(err,result)=>{
            if(err) throw err;
            if(result.result.ok){
              res.send("deleted "+id)
            } else {
              res.send("could not delete "+id)
            }
          });
        }
        client.close()
      });
    });
    
};
