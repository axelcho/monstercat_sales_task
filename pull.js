/**
 *
 *
 *This script assumes that the environment has mongodb running and node.js and npm installed.
 */


var csv = require("fast-csv");
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var stream = fs.createReadStream("fixeddata.csv");

MongoClient.connect('mongodb://localhost:27017/monstercat', function(err, db) {

  if(err) throw err;

  //drop if sales database exists  
  db.collection('sales').drop();
  
  csv(stream, {headers : true})
  .on("data", function(data){
 
   //read the "salePeriod" into year and month
    date = data.salePeriod.split("-");

   //set up year and month fields to the data
    data.year = date[0];
    data.month = date[1];
    
    //get rid of extra periods
    delete data['extra.stamp'];
    delete data['extra.generatedOn'];   
   
    //the sales data is string type by default, int type required for later aggregation operations.
    data.sales = parseInt(data.sales);
   
   //insert into database
    db.collection('sales').insert(data, function(err, inserted){
      if(err) throw err;
      
      });
   })
   
   //at the end of insert leave mongoclient
   .on("end", function(){
      console.log("done");
      
      //add some indexes, year, month, type;
      
      db.collection('sales').ensureIndex({"year":1}, function(err, indexed){
      if(err) throw err;
      
      });
      
      db.collection('sales').ensureIndex({"month":1}, function(err, indexed){
      if(err) throw err;
      
      });
      
      db.collection('sales').ensureIndex({"saleType":1}, function(err, indexed){
      if(err) throw err;
      
      });
      return db.close();
   })
   .parse();
});