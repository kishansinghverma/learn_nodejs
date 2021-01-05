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
        return {"insertedId" : res.insertedId, "name" : name};
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
async function saveSellerDetails(formData){
    let document = {
        name : formData.name,
        address : formData.address,
        mobile : formData.mobile !== undefined ? formData.mobile : "",
        txn : []
    }
    const result=await database.insertDocument('seller', document);
    if(result !== null && result.insertedCount > 0) {
        return {
            "insertedId": result.insertedId,
            "name": document.name,
            "address": document.address,
        };
    }
    return {};
}
async function updateSellerContact(sellerId, number){
    let query={_id:new mongo.ObjectID(sellerId)};
    let newVal={$addToSet: {contact:number}};
    await database.updateDocument('seller', query, newVal);
}
async function saveColdKharidData(formData){
    //Creating Header details
    let parentDocument = {
        "cold_id": formData.in_cold_id,
        "date": formData.in_date,
        "seller_id": formData.in_seller_id,
        "buyer_name": formData.in_buyer_name,
        "image_id": formData.in_image_id
    };

    //Saving header document
    let parentResult = await database.insertDocument("cold_kharid", parentDocument);

    //Checking if the header saved successfully
    if(parentResult !== null && parentResult.insertedCount > 0){
        let childDocuments = [];

        //Checking if there are multiple deals associated in form
        if(Array.isArray(formData.in_lot)){
            //Caching each deal individually
            for (let i = 0; i < formData.in_lot.length; i++) {
                let childDocument={
                    "lot_no":formData.in_lot[i],
                    "size":formData.in_size[i],
                    "bags":formData.in_bags[i],
                    "rate":formData.in_rate[i],
                    "tol":formData.in_tol[i],
                    "parent":"cold_kharid",
                    "parent_id":parentResult.insertedId
                }
                childDocuments.push(childDocument);
            }
        }
        else {
            let childDocument={
                "lot_no":formData.in_lot,
                "size":formData.in_size,
                "bags":formData.in_bags,
                "rate":formData.in_rate,
                "tol":formData.in_tol,
                "parent":"cold_kharid",
                "parent_id":parentResult.insertedId
            }
            childDocuments.push(childDocument);
        }

        let childResult = await database.insertDocuments("deals", childDocuments);

        //Checking if children saved successfully
        if(childResult !== null && childResult.insertedCount > 0){
            let childIds=[];
            for(let x in childResult.insertedIds){
                childIds.push(childResult.insertedIds[x]);
            }

            //Updating parent with child Ids
            let updates = {$set: {"child_ids": childIds}};
            let query = {_id: parentResult.insertedId};
            let finalResult=await database.updateDocument("cold_kharid", query, updates);

            //Checking if child Ids placed in Parent document
            if (finalResult !== null && finalResult.modifiedCount > 0) {
                //TODO: Customize response
                return {"parent": parentResult, "child": childResult};
            } else {
                //Delete parent record
                await database.deleteDocument("cold_kharid", {_id: parentResult.insertedId});

                //Delete child records
                let deleteSelection = {_id: {$in: childIds}};
                await database.deleteDocuments("deals", deleteSelection);
            }
        }
        else {
            //Delete parent record
            await database.deleteDocument("cold_kharid", {_id: parentResult.insertedId});
        }
    }
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
    saveSellerDetails,
    saveColdKharidData,
    saveColdStoreDetails,
    getColdStoreNames,
    getSellerDetails,
    getImageData,
    saveImages
}