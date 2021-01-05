function verifyInputs(inputs){
    for(let x of inputs){
        if(x===undefined || x==='')
            return false;
    }
    return true;
}

function len(object){
    return Object.keys(object).length;
}

function isEmpty(data){
    return len(data) === 0;
}

module.exports={
    verifyInputs,
    len,
    isEmpty,
}