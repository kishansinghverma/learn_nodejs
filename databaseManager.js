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
        return null;
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
        return null;
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
        return null;
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
        return null;
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
        return null;
    }
};

async function getColdStoreNames(){
    const data=await getList('cold_store', {}, {_id:0, name:1});
    if(data!==null)
        return data;
    return {};
}
async function insertColdStoreName(name, bag, due){
    const document={name:name, bag:bag, due:due};
    const res=await insertDocument('cold_store', document);
    if(res !== null)
        return res;
    return {};
}
async function getSellerDetails(){
    const data=await getList('seller', {}, {});
    if(data!==null)
        return data;
    return {};
}
async function saveImagesData(documents){
    let result=await insertDocuments('images', documents);
    if(result!==null)
        return result;
    return {};
}
async function getImageData(imageId){
    let _id;
    try{_id=new mongo.ObjectId(imageId);}
    catch (e){return {};}

    let data=await getDocument('images', {'_id':_id}, {})
    if(data!==null)
        return data;
    return {};
}
async function saveSellerDetails(document){
    const result=await insertDocument('seller', document);
    if(result!==null)
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
    if(result!==null)
        return result;
    return {};
}

module.exports={
    getColdStoreNames,
    insertColdStoreName,
    getSellerDetails,
    saveImagesData,
    saveColdKharidData,
    saveSellerDetails,
    updateSellerContact,
    getImageData
};