const express=require('express')
const path=require('path');
const mustacheExpress=require('mustache-express');
const controller=require('./controller');
const util=require('./utility');
const bodyParser=require('body-parser');

const app=express();
app.engine('html', mustacheExpress());
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res)=>{
    res.render('index.html');
});
app.get('/dashboard', (req, res)=>{
    res.render('dashboard.html');
});
app.get('/cold_kharid',async (req, res)=>{
    const data = {
        coldStore: await controller.getColdStoreNames(),
        seller: await controller.getSellerNames()
    };
    res.render('cold_kharid.html', data);
})
app.get('/kisan_kharid', (req, res)=>{
    res.end('Working');
});
app.get('/self_entry', (req, res)=>{
    res.end('Working');
});
app.get('/display_cold_kharid', (req, res)=>{
    res.end('Working');
});
app.get('/api/display_cold_kharid', (req, res)=>{
    res.end('Working');
});
app.post('/api/save_new_cold', async (req, res)=>{
    if(util.verifyInputs([req.body.name, req.body.bag, req.body.due])) {
        let result = await controller.saveColdStoreDetails(req.body.name, req.body.bag, req.body.due);
        if (result.statusCode !== undefined)
            res.status(result.statusCode).end();
        else
            res.json(result);
    }
    else
        res.status(400).end();
});
app.post('/api/save_new_seller', async (req, res)=>{
    if (util.verifyInputs([req.body.name, req.body.address])) {
        let result = await controller.saveSellerDetails(req.body);
        if (result.statusCode !== undefined)
            res.status(result.statusCode).end();
        else
            res.json(result);
    }
    else
        res.status(400).end();
})
app.post('/api/save_cold_kharid', async (req, res)=>{
    if(util.verifyInputs([req.body.date, req.body.cold_id, req.body.seller_id, req.body.buyer_name]) &&
        util.verifyArrayInputs([req.body.lot, req.body.size, req.body.bags, req.body.rate, req.body.tol])){

        let result = await controller.saveColdKharidData(req.body);
        if(result.statusCode !== undefined)
            res.status(result.statusCode).end();
        else
            res.json(result);
    }
    else
        res.status(400).end();
});

app.post('/api/image', (req, res)=> {
    let upload = controller.upload.array('files', 5);
    upload(req, res, async (err) => {
        if (err) {
            res.status(405).end();
        }
        else {
            if(req.files !== undefined) {
                let result = await controller.saveImages(req.files);
                if (result.statusCode !== undefined)
                    res.status(result.statusCode).end();
                else
                    res.json(result);
            }
            else
                res.status(400).end();
        }
    })
});
app.get('/api/image', async (req, res)=>{
    if(util.verifyInputs([req.query.id])) {
        let result = await controller.getImageData(req.query.id);
        if (result.image != null) {
            res.contentType('image/jpeg');
            res.send(result.image.buffer);
        }
        else
            res.status(404).end();
    }
    else
        res.status(400).end();
});
app.get('/api/cold_kharid_data', async (req, res)=>{
    if(util.verifyInputs([req.query.id])) {
        let result = await controller.getColdKharidData(req.query.id);
        if(result.statusCode !== undefined)
            res.status(result.statusCode).end();
        else
            res.json(result);
    }
    else
        res.status(400).end();
});

app.get('/error', (req, res)=>{
    let error = "Unknown Error!";
    if(util.verifyInputs([req.query.msg]))
        error = req.query.msg;
    res.render('error_page.html', {error:error});
});

app.get('/test', async (req, res)=>{
    res.render('test.html');
});

app.post('/test', async (req, res)=>{
    console.log("Debug Run Test");
    console.log(JSON.stringify(req))
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