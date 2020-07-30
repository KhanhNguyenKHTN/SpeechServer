var http = require('http');
var db = require('./database');
http.createServer(function (request, response) {
    const { headers, method, url } = request;
    let body = [];
    request.on('error', (err) => {
      console.error(err);
    }).on('data', (chunk) => {
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      Direction(request, body)
    });
    
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.write('Hello World!');
    response.end();
}).listen(8080);
console.log("Server start in port 8080");

function Direction(request, body) {
    if(request.method == 'POST')
    {
        //call Back Function
        // var data = JSON.parse(body);
        // db.UpdateLink(data.message);
        // console.log('post', data.message);
        console.log(body);
    }
    else if (request.method == 'GET'){
        //Redirect function
        switch (request.url) {
            case '/':               
                break;
            case '/home':
                
                break;
            default:
                break;
        }
    }
}