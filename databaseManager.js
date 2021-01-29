const mongo=require('mongodb');
const MongoClient=mongo.MongoClient;
const url='mongodb://127.0.0.1:27017/Potato_Manager';
const params={useUnifiedTopology: true};

const getList = async (collectionName, query, projection) => {
    let client;
    let data;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        data = await collection.find(query).project(projection).toArray();
        await client.close();
        return data;

    } catch (err) {
        console.log(err.stack);
        return null;
    }
};
const getDocument = async (collectionName, query, projection) => {
    let client;
    let data;

    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        data = await collection.findOne(query, {projection: projection});
        await client.close();
        return data;

    } catch (err) {
        console.log(err.stack);
        return null;
    }
};
const insertDocument = async (collectionName, document) => {
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.insertOne(document);
        await client.close();
        delete res['ops'];
        return res;

    } catch (err) {
        console.log(err.stack);
        return null;
    }
};
const insertDocuments = async (collectionName, documents) => {
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.insertMany(documents);
        await client.close();
        delete res['ops'];
        return res;

    } catch (err) {
        console.log(err.stack);
        return null;
    }

};
const updateDocument = async (collectionName, query, newVal) => {
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.updateOne(query, newVal);
        await client.close();
        return res;

    } catch (err) {
        console.log(err.stack);
        return null;
    }
};
const deleteDocument = async (collectionName, query) => {
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.deleteOne(query);
        await client.close();
        return res;

    } catch (err) {
        console.log(err.stack);
        return null;
    }
};
const deleteDocuments = async (collectionName, query) => {
    let client;
    let res;
    try {
        client = await MongoClient.connect(url, params);
        const db = client.db();
        const collection = db.collection(collectionName);
        res = await collection.deleteMany(query);
        await client.close();
        return res;

    } catch (err) {
        console.log(err.stack);
        return null;
    }
};



module.exports={
    getList,
    getDocument,
    insertDocument,
    insertDocuments,
    updateDocument,
    deleteDocument,
    deleteDocuments
};