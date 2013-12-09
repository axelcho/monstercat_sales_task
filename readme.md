Monstercat Sales Data Analysis Module by Seong Cho 


Environment: 

Preferrably Linux or Mac
*"convert.js" does not run in windows environment (windows does not have sed). The other 2 files work fine with windows.
For windows environment, the file should be converted manually via excel/openoffice.
running mongodb required
node.js required


How to use:

run the node.js files by the following order.

node convert.js
node pull.js
node app.js


Included files:

convert.js: This file cleans up the apostrophe(') from the data file. Apostrophes are causes of common javascript errors.
pull.js: This file reads the cleaned data file and insert the data into a mongodb database.
app.js: This is web server file that pulls sales data from the mongodb and repackage them for google chart data format.
view/index.html: main template file. This file makes use of google chart library and JQuery.

local.htm: The view-source capture of the local result that I see, in case it does not load correctly in other environment. 

/node_modules: npm module files used in these scripts.