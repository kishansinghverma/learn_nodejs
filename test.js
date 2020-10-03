var db=require('./databaseManager');

(async ()=>{
    console.log(await db.getColdStoreNames());
})();
