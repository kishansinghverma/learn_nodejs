var db=require('./databaseManager');
var util=require('./utility');
const mustacheExpress=require('mustache-express');

data={"arr":[1,2,3,"ki"]}
console.log(util.len(data))
console.log(data.arr.length);