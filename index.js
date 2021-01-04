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
    res.render('index.html', {page:'dashboard', data:''});
    res.end();
});

app.get('/dashboard', (req, res)=>{
    res.render('dashboard.html', null);
    res.end();
});
app.get('/cold_kharid',async (req, res)=>{
    res.render('cold_kharid.html');
    res.end();
})
app.get('/kisan_kharid', (req, res)=>{
    res.end('Working');
});

app.get('/self_entry', (req, res)=>{
    res.end('Working');
});

app.post('/api/save_new_cold', async (req, res)=>{
    if(util.verifyInputs([req.body.name, req.body.bag, req.body.due])) {
        let result = await controller.saveColdStoreDetails(req.body.name, req.body.bag, req.body.due);
        res.json(result);
    }
    else
        res.status(400);
    res.end();
});

app.post('/api/cold_kharid', async (req, res)=>{
    let result=await util.saveColdKharid(req.body);
    res.json(result);
    res.end();
});

app.post('/api/image', (req, res)=> {
    let upload = controller.upload.array('in_files', 5);
    upload(req, res, async (err) => {
        if (err) {
            res.status(403);
        }
        else {
            if(req.files !== undefined) {
                let result = await controller.saveImages(req.files);
                res.json(result);
            }
            else {
                res.status(400);
            }
        }
        res.end();
    })
});
app.get('/api/image', async (req, res)=>{
    if(req.query.id != null) {
        let result = await controller.getImageData(req.query.id);
        if (result.image != null) {
            res.contentType('image/jpeg');
            res.send(result.image.buffer);
        }
        else
            res.status(404);
    }else
        res.status(400);
    res.end();
});

app.get('/error', (req, res)=>{
    if(req.query.msg===undefined || req.query.msg==='')
        req.query.msg="Unknown Error!";
    res.render('error_page.html', {error:req.query.msg});
});
app.get('*', (req, res)=>{
    res.redirect('/error?msg=Invalid Request Type! (GET)')
});
app.post('*', (req, res)=>{
    res.redirect('/error?msg=Invalid Request Type! (POST)')
});

app.post('/test', async (req, res)=>{
    res.send({});
    res.end();
});

app.listen(8000);
console.log("Listening on 8000");