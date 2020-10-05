var db=require('./databaseManager');
const mustacheExpress=require('mustache-express');

(async ()=>{
    const data=await db.getColdStoreNames();
    console.log(data);
})();

