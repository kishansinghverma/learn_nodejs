var db=require('./databaseManager');
var util=require('./utility');
const mustacheExpress=require('mustache-express');

(async ()=>{
    const data=await db.getSellerMobile("kishan");
    console.log(data);
})();
//console.log(Object.keys({kishan:"yes", class:"1st"}).length)

