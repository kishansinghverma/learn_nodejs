const multer = require('multer');
const mongo=require('mongodb');
const fs = require('fs');
const database=require('./databaseManager');

function verifyInputs(inputs){
    for(let x of inputs){
        if(x===undefined || x==='')
            return false;
    }
    return true;
}

let len=(object)=>{
    return Object.keys(object).length;
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
        return await database.saveImagesData(imageBinaries);
    else
        return {};
}
let saveColdKharid=async (formData, imageData)=>{
    //Saving images and returning their IDs
    let imageIDs;
    let imgData=await saveImages(imageData);
    if(len(imgData)>0)
        imageIDs=imgData.insertedIds;
    else
        imageIDs={};

    //Checking & saving seller details
    let seller_id=formData.in_seller_id;
    if(formData.in_seller_id===undefined || formData.in_seller_id===''){
        const sellerData={
            name:formData.in_seller_name,
            contact:[formData.in_seller_mobile]
        };
        let result=await database.saveSellerDetails(sellerData);
        if(len(result)>0)
            seller_id=result.insertedId;
        else
            throw "Database Error: Seller Id";
    }
    else
        await database.updateSellerContact(seller_id, formData.in_seller_mobile);

    //creating final document
    const document={
        date:formData.in_date,
        cold_name:formData.in_cold_name,
        seller_id: new mongo.ObjectID(seller_id),
        buyer_name:formData.in_buyer_name,
        buyer_mobile:formData.in_buyer_mobile,
        lot:formData.in_lot,
        type:formData.in_type,
        bag:formData.in_bag,
        rate:formData.in_rate,
        tol:formData.in_tol,
        images:imageIDs
    }

    let result=await database.saveColdKharidData(document);
    return result;
}

module.exports={
    verifyInputs,
    upload,
    saveImages,
    saveColdKharid,
    len
}