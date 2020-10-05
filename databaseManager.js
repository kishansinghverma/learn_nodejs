const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017/Potato_Manager';
const params={useUnifiedTopology: true};

const getList=async (collectionName, query)=> {
    let client;
    let data;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        data = await collection.find(query).toArray();

    } catch (err) {console.log(err.stack);}

    client.close();
    return data;
};

const insertOne= async (collectionName, document)=>{
    let client;
    let res;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.insertOne(document);

    } catch (err) {console.log(err.stack);}

    client.close();
    return res;

}

async function getColdStoreNames(){
    const data=await getList('cold_store', {});
    return data;
}

async function insertColdStoreName(name, bag, due){
    const document={name:name, bag:bag, due:due};
    const res=await insertOne('cold_store', document);
    if(res != undefined)
        return (res.insertedCount===1)
    return false;
}

module.exports={
    getColdStoreNames,
    insertColdStoreName
};