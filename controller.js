const multer = require('multer');
const fs = require('fs');
const database=require('./databaseManager');
const util = require('./utility');

async function getColdStoreNames(){
    const data=await database.getList('cold_store', {}, {name:1});
    if(data!==null)
        return data;
    return {};
}
async function getColdKharidData(documentId){
    let _id;
    if(util.isValid(documentId)) {
        _id = util.getObjectId(documentId);
    }
    else
        return {statusCode:400};

    let parameters=[
        {$lookup:{from:"cold_store", localField:"cold_id", foreignField:"_id", as:"cold_store"}},
        {$lookup:{from:"seller", localField:"seller_id", foreignField:"_id", as:"seller"}},
        {$lookup:{from:"deals", localField:"child_ids", foreignField:"_id", as:"deals"}},
        {$match:{_id:_id}},
        {$project:{cold_id:0, seller_id:0, child_ids:0, cold_store:{_id:0, bag:0, due:0}, seller:{_id:0, txn:0}}}
        ];
    const data=await database.getAggregatedDocument('cold_kharid', parameters);
    if(data!==null)
        if (util.len(data)>0)
            return data;
        else
            return {statusCode: 404};

    return {statusCode:500};
}
async function saveColdStoreDetails(name, bag, due){
    let queryDocument=await database.getList('cold_store', {name:name});
    if(util.len(queryDocument)>0)
        return {statusCode:409};

    const document={name:name, bag:bag, due:due};
    const res=await database.insertDocument('cold_store', document);
    if(res !== null && res.insertedCount > 0)
        return {"insertedId" : res.insertedId, "name" : name};
    return {statusCode:500};
}
async function getSellerNames(){
    const data=await database.getList('seller', {}, {name:1, address:1, mobile:1});
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
    if(util.isValid(imageId))
        _id = util.getObjectId(imageId);
    else return {statusCode:400};

    let data=await database.getDocument('images', {'_id':_id}, {})
    if(data!==null)
        return data;
    return {statusCode:500};
}
async function saveSellerDetails(formData){
    let queryDocument=await database.getList('seller', {name: formData.name, mobile: formData.mobile, address: formData.address});
    if(util.len(queryDocument)>0)
        return {statusCode:409};

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
            "mobile":document.mobile
        };
    }
    return {statusCode:500};
}
async function saveColdKharidData(formData){
    //Preparing ObjectIds
    let cold_id, seller_id, image_ids=[];
    if(util.isValid(formData.cold_id) && util.isValid(formData.seller_id)) {
        cold_id = util.getObjectId(formData.cold_id);
        seller_id = util.getObjectId(formData.seller_id);
    }
    else
        return {statusCode:400};

    if(formData.image_ids !== undefined)
        for (let x of formData.image_ids)
            if(util.isValid(x))
                image_ids.push(util.getObjectId(x));

    //Creating Header details
    let parentDocument = {
        "cold_id": cold_id,
        "date": formData.date,
        "seller_id": seller_id,
        "buyer_name": formData.buyer_name,
        "image_ids": image_ids
    };

    //Saving header document
    let parentResult = await database.insertDocument("cold_kharid", parentDocument);

    //Checking if the header saved successfully
    if(parentResult !== null && parentResult.insertedCount > 0){
        let childDocuments = [];

        //Checking if there are multiple deals associated in form
        for (let i = 0; i < formData.lot.length; i++) {
            let childDocument = {
                "lot": formData.lot[i],
                "size": formData.size[i],
                "bags": formData.bags[i],
                "rate": formData.rate[i],
                "tol": formData.tol[i],
                "parent": "cold_kharid",
                "parent_id": parentResult.insertedId
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
                return {parentResult};
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
    return {statusCode:500};
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
    getColdKharidData,
    getColdStoreNames,
    getSellerNames,
    getImageData,
    saveImages
}