const multer = require('multer');
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
let saveImageData= async (files)=> {
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
        return await database.saveImages(imageBinaries);
}

module.exports={
    verifyInputs,
    upload,
    saveImageData,
    len
}