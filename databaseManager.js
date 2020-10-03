const MongoClient=require('mongodb').MongoClient;
const url='mongodb://127.0.0.1:27017/Potato_Manager';
const params={useUnifiedTopology: true};

const getList=(async function(collectionName, query) {
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
});

async function getColdStoreNames(){
    const data=await getList('cold_store', {});
    return data;
}

module.exports={getColdStoreNames};