const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const lib = require('./lib');
const db = require('./database');
const fs = require('fs');

router.post('/update/audio', function (req, res) {
    const { headers, method, url } = req;
    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        try {
            body = Buffer.concat(body).toString();
            var data = JSON.parse(body);
            // console.log("Demo: ", body);
            // res.send(body);
            db.updateDownLoad(data.message, function (err, info) {
                if (err) {
                    console.log(err);
                    res.send(err);
                }
                lib.downloadAudio(info.direction, info.fileName, info.url);
                res.send('Done');
            });
        } catch {
            res.send('error');
        }
    });
})

router.post('/update/youtube', function (req, res) {
    const { headers, method, url } = req;
    let body = [];
    req.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        var data = JSON.parse(body);
        db.updateDownLoad(data, function (err, info) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            lib.downloadAudio(info.direction, info.fileName, info.url);
            res.send('Done');
        });
    });
})

router.get('/', function (req, res) {
    // res.sendFile(path.join(__dirname + '/index.html'));
    console.log(res.url);
    res.send("Home Nothing")
    //__dirname : It will resolve to your project folder.
});

router.get('/chuong/:id', function (req, res) {
    const range = req.headers.range;
    console.log(range);
    const filePath = path.join(__dirname, '/Data/Fix/Chuong' + req.params.id);
    const stat = fs.statSync(filePath);
    const total = stat.size;
    res.writeHead(200, {
        'Content-Range': 'bytes ' + 0 + '-' + (total -1) + '/' + total,
        'Accept-Ranges': 'bytes',
        'Content-Type': 'audio/mpeg',
        'Content-Length': stat.size
    });

    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);
    // res.setHeader("Content-Type:","audio/mpeg")
    // res.sendFile(path.join(__dirname + '/Data/Chuong' + req.params.id));
    // res.send(req.params.id);
    //__dirname : It will resolve to your project folder.
});


router.get('/data/:storename/:bookId', function (req, res) {
    console.log('aasdsadasds');
    res.send(req.params);
    //__dirname : It will resolve to your project folder.
});

router.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});

router.get('/about', function (req, res) {
    res.sendFile(path.join(__dirname + '/about.html'));
});

router.get('/sitemap', function (req, res) {
    res.sendFile(path.join(__dirname + '/sitemap.html'));
});

//add the router
app.use('/', router);
app.listen(process.env.port || 8888);

console.log('Running at Port http://localhost:8888/');