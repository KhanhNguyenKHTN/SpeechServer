var http = require('http');

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
    console.log("url" , request.url);
    console.log("Method" , request.method);
    if(request.method == 'POST')
    {
        console.log('post', body);
    }
}