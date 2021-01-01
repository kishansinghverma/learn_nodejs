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
    res.render('index.html', {page:'dashboard', data:''});
});

app.get('/dashboard', (req, res)=>{
    res.render('dashboard.html', null);
});

app.get('/cold_kharid',async (req, res)=>{
    const data = {
        coldStore: await database.getColdStoreNames(),
        seller:await database.getSellerDetails()
    };
    res.render('cold_kharid.html', data);
})



app.get('/kisan_kharid', (req, res)=>{
    res.end('Working');
});

app.get('/self_entry', (req, res)=>{
    res.end('Working');
});

app.post('/api/save_new_cold', async (req, res)=>{
    if(util.verifyInputs([req.body.name, req.body.bag, req.body.due])) {
        let result = await database.insertColdStoreName(req.body.name, req.body.bag, req.body.due);
        if (util.len(result)>0)
            res.json(await database.getColdStoreNames());
        else
            res.json({});
    }else
        res.redirect('/error');
});

app.post('/handler/cold_kharid', async (req, res)=>{
    /*let upload=util.upload.array('in_files', 5);

    upload(req, res, async (err)=>{
        if (err)
            res.redirect('/error?msg='+err);
        else {
            console.log(req.body);
            let result=await util.saveColdKharid(req.body, req.files);
            if(result.insertedId != null)
                res.render('index.html', {page:'cold_kharid', data:result.insertedId});
        }
    })*/
});
app.post('/api/image', (req, res)=>{
    let upload=util.upload.array('in_files', 5);
    upload(req, res, async (err)=>{
        if (err)
            res.redirect('/error?msg='+err);
        else {
            let result = await util.saveImages(req.files);
            res.json(result);
        }
        res.end();
    })
});
app.get('/api/image', async (req, res)=>{
    if(req.query.id != null) {
        let result = await database.getImageData(req.query.id);
        if (result.image != null) {
            res.contentType('image/jpeg');
            res.send(result.image.buffer);
        } else
            res.status(404);
    }else
        res.status(400);
    res.end();
});

app.get('/form', (req, res)=>{
    res.render('test.html', null);
});

app.post('/test', async (req, res, next)=>{
    res.send({});
    res.end();
});

app.get('*', (req, res)=>{
    res.redirect('/error?msg=Invalid Request Type! (GET)')
});
app.post('*', (req, res)=>{
    res.redirect('/error?msg=Invalid Request Type! (POST)')
});

app.listen(8000);
console.log("Listening on 8000");