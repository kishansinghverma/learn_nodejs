const express=require('express')
const path=require('path');
const mustacheExpress=require('mustache-express');

const app=express();
app.engine('html', mustacheExpress());
app.set(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


app.get('/', (req, res)=>{
    console.log("Hit...");
    res.render('t2', null);
});

app.get('/test', (req, res)=>{
    res.render('test',
        {
        students:
            {
                s1:{
                    name:'kishan',
                    sub:'computer'
                },
                s2:{
                    name: 'amit',
                    sub:'node'
                }
            }
        }
        );
})

app.listen(8000);
console.log("Listening on 8000");