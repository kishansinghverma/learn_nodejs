const express=require('express')
const path=require('path');
const mustacheExpress=require('mustache-express');
const database=require('./databaseManager');
const util=require('./utility');
const bodyParser=require('body-parser');

const app=express();
app.engine('html', mustacheExpress());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/error', (req, res)=>{
    if(req.query.msg===undefined || req.query.msg==='')
        req.query.msg="Unknown Error!";
    res.render('error_page.html', {error:req.query.msg});
});

app.get('/', (req, res)=>{
    res.render('index.html',null);
});

app.get('/dashboard', (req, res)=>{
    res.render('dashboard.html', null);
});

app.get('/cold_kharid',async (req, res)=>{
    const data = {
        coldStore: await database.getColdStoreNames(),
        seller:await database.getSellerNames()
    };
    res.render('cold_kharid.html', data);
})

app.get('/kisan_kharid', (req, res)=>{
    res.end('Working');
});

app.get('/self_entry', (req, res)=>{
    res.end('Working');
});

app.post('/db/new_cold', async (req, res)=>{
    if(util.verifyInputs([req.body.name, req.body.bag, req.body.due])) {
        let result = await database.insertColdStoreName(req.body.name, req.body.bag, req.body.due);
        if (util.len(result)>0)
            res.json(await database.getColdStoreNames());
        else
            res.json({});
    }else
        res.redirect('/error');
});

app.post('/db/seller_mobile', async (req, res)=>{
    let name=req.body.name;
    if(util.verifyInputs([name])) {
        let result = await database.getSellerMobile(req.body.name);
        res.json(result);
    }else {
        res.redirect('/error');
    }
});

app.post('/handler/cold_kharid', async (req, res)=>{
    let upload=util.upload.array('in-files', 5);

    upload(req, res, async (err)=>{
        console.log(JSON.stringify(req.body));
        if (err)
            res.redirect('/error?msg='+err);
        else {
            let imgData=await util.saveImageData(req.files);
            let result=saveColdStoreData(req.body, imgData);
            res.json(result);
        }
    })
});

app.get('/form', (req, res)=>{
    res.render('test.html', null);
});

app.post('/test', async (req, res, next)=>{
    res.end();
});

app.listen(8000);
console.log("Listening on 8000");