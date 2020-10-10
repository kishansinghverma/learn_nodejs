const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
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
const updateDocument=async (collectionName, query, newVal)=>{
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.updateOne(query, newVal);
        client.close();
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
    const data=await getList('seller', {}, {});
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
async function saveImagesData(documents){
    const result=await insertDocuments('images', documents);
    if(result!=undefined)
        return result;
    return {};
}
async function saveSellerDetails(document){
    const result=await insertDocument('seller', document);
    if(result!=undefined)
        return result;
    return {};
}
async function updateSellerContact(sellerId, number){
    let query={_id:new mongo.ObjectID(sellerId)};
    let newVal={$addToSet: {contact:number}};
    await updateDocument('seller', query, newVal);
}
async function saveColdKharidData(document){
    const result=await insertDocument('cold_kharid', document);
    if(result!=undefined)
        return result;
    return {};
}

module.exports={
    getColdStoreNames,
    insertColdStoreName,
    getSellerNames,
    getSellerMobile,
    saveImagesData,
    saveColdKharidData,
    saveSellerDetails,
    updateSellerContact
};