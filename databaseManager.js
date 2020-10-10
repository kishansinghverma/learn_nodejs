const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017/Potato_Manager';
const params={useUnifiedTopology: true};

const getList=async (collectionName, query, projection)=> {
    let client;
    let data;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        data = await collection.find(query).project(projection).toArray();
        client.close();
        return data;

    } catch (err) {
        console.log(err.stack);
        return undefined;
    }
};
const getDocument=async (collectionName, query, projection)=> {
    let client;
    let data;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        data = await collection.findOne(query, {projection: projection});
        client.close();
        return data;

    } catch (err) {
        console.log(err.stack);
        return undefined;
    }
};
const insertDocument= async (collectionName, document)=>{
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.insertOne(document);
        client.close();
        delete res['ops'];
        return res;

    } catch (err) {
        console.log(err.stack);
        return undefined;
    }
};
const insertDocuments= async (collectionName, documents)=>{
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.insertMany(documents);
        client.close();
        delete res['ops'];
        return res;

    } catch (err) {
        console.log(err.stack);
        return undefined;
    }

};

async function getColdStoreNames(){
    const data=await getList('cold_store', {}, {_id:0, name:1});
    if(data!=undefined)
        return data;
    return {};
}
async function insertColdStoreName(name, bag, due){
    const document={name:name, bag:bag, due:due};
    const res=await insertDocument('cold_store', document);
    if(res != undefined)
        return res;
    return {};
}
async function getSellerNames(){
    const data=await getList('seller', {}, {_id:0, name:1});
    if(data!=undefined)
        return data;
    return {};
}
async function getSellerMobile(name){
    const data=await getDocument('seller', {name:name}, {_id:0, contact:1});
    if(data!=undefined)
        return data;
    return {};
}
async function saveImages(documents){
    const result=await insertDocuments('images', documents);
    if(result!=undefined)
        return result;
    return {};
}
async function saveColdKharid(data, image){
    console.log(data, image);
    const document={
        //cold_name:data.
    }
    return {};
}

module.exports={
    getColdStoreNames,
    insertColdStoreName,
    getSellerNames,
    getSellerMobile,
    saveImages,
    saveColdKharid
};