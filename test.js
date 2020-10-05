var db=require('./databaseManager');
const mustacheExpress=require('mustache-express');

(async ()=>{
    const data=await db.insertColdStoreName('Maa Bhadrakali Cold Store', 0, 0);
    console.log(data);
})();

