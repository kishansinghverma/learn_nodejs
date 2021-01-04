const multer = require('multer');
const mongo=require('mongodb');
const fs = require('fs');
const database=require('./databaseManager');

async function getColdStoreNames(){
    const data=await database.getList('cold_store', {}, {_id:0, name:1});
    if(data!==null)
        return data;
    return {};
}
async function saveColdStoreDetails(name, bag, due){
    const document={name:name, bag:bag, due:due};
    const res=await database.insertDocument('cold_store', document);
    if(res !== null && res.insertedCount > 0)
        return {"inserted_cold" : name};
    return {};
}
async function getSellerDetails(){
    const data=await database.getList('seller', {}, {});
    if(data!==null)
        return data;
    return {};
}
async function saveImagesData(documents){
    let result=await database.insertDocuments('images', documents);
    if(result!==null)
        return result;
    return {};
}
async function getImageData(imageId){
    let _id;
    try{_id=new mongo.ObjectId(imageId);}
    catch (e){return {};}

    let data=await database.getDocument('images', {'_id':_id}, {})
    if(data!==null)
        return data;
    return {};
}
async function saveSellerDetails(document){
    const result=await database.insertDocument('seller', document);
    if(result!==null)
        return result;
    return {};
}
async function updateSellerContact(sellerId, number){
    let query={_id:new mongo.ObjectID(sellerId)};
    let newVal={$addToSet: {contact:number}};
    await database.updateDocument('seller', query, newVal);
}
async function saveColdKharidData(document){
    const result=await database.insertDocument('cold_kharid', document);
    if(result!==null)
        return result;
    return {};
}

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    },
})
let fileFilter = (req, file, cb)=>{
    if(file.mimetype.startsWith('image/'))
        cb(null, true);
    else
        cb(null, false);
};
let upload=multer({
    storage:storage,
    fileFilter: fileFilter
});
let saveImages= async (files)=> {
    let imageBinaries = [];
    for (let file of files) {
        let img = fs.readFileSync(file.path);
        let imgBinary = img.toString('base64');
        let imgObject = {
            contentType: file.mimetype,
            image: new Buffer.alloc(imgBinary.length, imgBinary, 'base64')
        };
        imageBinaries.push(imgObject);
        fs.unlink(file.path, (err) => {
            if (err)
                console.log("Error Deleting File!")
        });
    }
    if(imageBinaries.length>0)
        return await saveImagesData(imageBinaries);
    else
        return {};
}

module.exports={
    upload,
    saveColdKharidData,
    saveColdStoreDetails,
    getColdStoreNames,
    getImageData,
    saveImages
}