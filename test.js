var db=require('./databaseManager');
var util=require('./utility');
const mustacheExpress=require('mustache-express');

(async ()=>{
    const data=await db.updateSellerContact("5f81f7361d27dc2eaca46dde", '9719814140');

    //const data=await db.getSellerNames();
    console.log(data);
})();
//console.log(Object.keys({kishan:"yes", class:"1st"}).length)

