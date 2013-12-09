/**
 *This script cleans apostrophe from testdata file.
 */
 
 
var sys = require('sys');
var exec = require('child_process').exec; 

function puts(error, stdout, stderr) { sys.puts(stdout); }
exec('sed s/"\'"/" "/g testdata.csv > fixeddata.csv', puts);