const db=require('./databaseManager');
const util=require('./utility');
const controller=require('./controller');

async function test(){
    let data = await controller.getColdKharidData("60218cbc08582835c4d8b4a4");
    console.log(JSON.stringify(data));
}
test();