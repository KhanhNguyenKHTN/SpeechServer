const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const lib = require('./lib');
const db = require('./database');

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
    res.sendFile(path.join(__dirname + '/index.html'));
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