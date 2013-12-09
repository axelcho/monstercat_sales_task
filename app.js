/*
* This is the main script that launches website. It pulls from mongodb database. The data was inserted 
* via pull.js included in the same archive. Some changes were applied when inserting data: 'year' and  
* 'month' were added from Sale Period column. Another important change is that the "sales" column was 
* string in the original data, but converted to integer in this setup.  
*/

var app = require('express')(),
  swig = require('swig'),
   MongoClient = require('mongodb').MongoClient;  
   
   
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views'); 

MongoClient.connect('mongodb://localhost:27017/monstercat', function(err, db) {

  if(err) throw err;
  
  //aggregate the data
  //$group: gather the sum by year/month/type
  //$project: shows just year/month/type/sum
   //$sort: sort the output
  
  db.collection('sales').aggregate([{$group:{"_id":{"year":"$year", "month":"$month", "type":"$saleType", "item":"$itemType"}, "sum": {"$sum":1}}}, {$project:{"year":"$_id.year", "month":"$_id.month", "type":"$_id.type", "item":"$_id.item", "_id":0, "sum":1}}, {$match: {"type": {$in:["Streaming", "Download"]}}}, {$sort: {"year":1, "month":1, "type":1, "item":1}}], function(err, result){
  
    if(err) throw err;
    
	
	
    //repackaging the result
	
	//category values
    Streaming = [["Month", "Streaming"]];
    Album = [["Month", "Album"]];
	Single = [["Month", "Single"]];
    Total = [["Month", "Album", "Single", "Streaming", "Total"]];
 
    //Unique List of Months
    resultlen = result.length;
    Months = []; 
    
    for (i = 0; i< resultlen; i++)
    {
    month = result[i].year + " " + result[i].month; 
    if (Months.indexOf(month) < 0) 
        {
        Months.push(month);    
        }
    }
    
    monthlen = Months.length;
    
	//loop the months
    for (j = 0; j< monthlen; j++)
    {
    month = Months[j].split(" ")[1];
    year =  Months[j].split(" ")[0];

    //default values
    streaming = 0;
    album = 0;
	single =0;
  

    //Look up inside the json data  
        for (k = 0; k< resultlen; k++){
        
        if(result[k].year == year && result[k].month == month && result[k].type == 'Streaming')
            {
                streaming = result[k].sum;
            }
        if(result[k].year == year && result[k].month == month && result[k].type == 'Download' && result[k].item == 'Track')
            {
                single = result[k].sum;
            }
		if(result[k].year == year && result[k].month == month && result[k].type == 'Download' && result[k].item == 'AlbumTrack')
            {
                album = result[k].sum;
            }
        
        }
		
        //get the total
        total = streaming + album + single;
   
   //format the month for google chart
    monthyear = month + "/" + year;
        
    //push to the data arrays
    Streaming.push([monthyear, streaming]);
    Album.push([monthyear, album]);
	Single.push([monthyear, single]);
    Total.push([monthyear, album, single, streaming, total]); 
    }
    
  
    //route and put up the template, load variables
    app.get('/', function(req, res){
      res.render('index', {
        Streaming: Streaming,
        Album: Album,
		Single: Single,
        Total: Total
        
      });
    });
    

    app.listen(3000);
    console.log('Express server listening on port 3000'); 
  }); 

});