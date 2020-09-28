var http=require('http');
var fs=require('fs')

function server(req, res){
    fs.readFile('HTML_Components/bs_first.html', function (err, data){
        if(err){
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write("Working");
        return res.end();
    })
}

http.createServer(server).listen(8080);
