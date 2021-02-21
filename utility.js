const mongo=require('mongodb');

function verifyInputs(inputs){
    for(let x of inputs){
        if(x===undefined || typeof x !== 'string' || x==='')
            return false;
    }
    return true;
}
function verifyArrayInputs(inputs){
    if(Array.isArray(inputs[0])) {
        for (let x of inputs)
            if (!Array.isArray(x) || len(x)<1)
                return false

        for (let i = 0; i < inputs[0].length; i++)
            for (let x of inputs)
                if (x[i] === undefined || x[i] === '')
                    return false;
        return true;
    }
    return false;
}
function len(object){
    return Object.keys(object).length;
}
function isEmpty(data){
    return len(data) === 0;
}
function isValid(ObjectId){
    return mongo.ObjectID.isValid(ObjectId);
}
function getObjectId(ObjectId){
    return mongo.ObjectId(ObjectId);
}

module.exports={
    verifyInputs,
    verifyArrayInputs,
    len,
    isEmpty,
    isValid,
    getObjectId
}