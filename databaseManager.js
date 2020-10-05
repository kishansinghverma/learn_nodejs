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
        client.close();
        return data;

    } catch (err) {
        console.log(err.stack);
        return undefined;
    }
};

const insertDoucument= async (collectionName, document)=>{
    let client;
    let res;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.insertOne(document);
        client.close();
        return res;

    } catch (err) {
        console.log(err.stack);
        return undefined;
    }
}

async function getColdStoreNames(){
    const data=await getList('cold_store', {});
    if(data!=undefined)
        return data;
    return {};
}

async function insertColdStoreName(name, bag, due){
    const document={name:name, bag:bag, due:due};
    const res=await insertDoucument('cold_store', document);
    if(res != undefined)
        return true;
    return false;
}

module.exports={
    getColdStoreNames,
    insertColdStoreName
};