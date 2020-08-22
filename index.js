const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const lib = require('./lib');
const db = require('./database');
const fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
var formidable = require('formidable');
const { url } = require('inspector');

router.post('/update/audio', function (req, res) {
  try{
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
    
  }catch{
      res.send('ERROR');
  }
});

router.get('/configfile', function (req, res) {
    try{
      res.sendFile(path.join(__dirname + '/config.txt'));
    }catch
    {
        res.send("ERROR");
    }
  });

router.get('/upload', function (req, res) {
  try{
    res.render('upload');
  }catch
  {
      res.send("ERROR");
  }
});

router.post('/upload', function (req, res) {
    try{
        //Khởi tạo form
        var form = new formidable.IncomingForm();
        //Thiết lập thư mục chứa file trên server
        form.uploadDir = "";
        //xử lý upload
        form.parse(req, function (err, fields, file) {
            //path tmp trên server
            var path = file.files.path;
            //thiết lập path mới cho file
            var newpath = form.uploadDir + file.files.name;
            fs.rename(path, newpath, function (err) {
                if (err) throw err;
                res.render('upload', {message: "Upload thanh cong!"});
            });
        });
      
    }catch{
        res.send('ERROR');
    }
});

router.get('/chuong/:id', function (req, res) {
  try{
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

  }catch{
      res.send("ERROR");
  }
  // res.setHeader("Content-Type:","audio/mpeg")
  // res.sendFile(path.join(__dirname + '/Data/Chuong' + req.params.id));
  // res.send(req.params.id);
  //__dirname : It will resolve to your project folder.
});

router.get('/download/chuong/:id', function (req, res) {
  try{
      const range = req.headers.range;
      console.log(range);
      const filePath = path.join(__dirname, '/Data/TheGioiHoanMy/Chuong' + req.params.id);
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

  }catch{
      res.send("ERROR");
  }
  // res.setHeader("Content-Type:","audio/mpeg")
  // res.sendFile(path.join(__dirname + '/Data/Chuong' + req.params.id));
  // res.send(req.params.id);
  //__dirname : It will resolve to your project folder.
});

router.get('/index', function (req, res) {
  res.redirect('/audio/?limit=10&page=1');
});

router.get('/audio', function (req, res) {
    console.log(req.url);
    try{
      var search =req.query.search;
      var page = 0; //parseInt(req.query.page, 10);
      var limit = 10;// parseInt(req.query.limit, 10);
      if(!search){
        page = parseInt(req.query.page, 10);
        limit = parseInt(req.query.limit, 10);
      }

      fs.readdir('./Data/Fix/', (err, files) => {
          files = lib.sortListFiles(files);
          var maxPage = files.length % limit == 0 ? Math.floor(files.length / limit) : Math.floor(files.length / limit) + 1;
          var result = [];
          var currentSourceIndex = 0;

          if(page > maxPage) res.redirect('/getpage/?limit=' + limit + '&page=' + maxPage); // page = maxPage;
          if(search){
            currentSourceIndex = lib.getSourcePosition(files,search);
            console.log('search: ', search, 'currentSourceIndex: ', currentSourceIndex);
            var tempIndex =currentSourceIndex + 1;
            page = tempIndex % limit == 0 ? Math.floor(tempIndex / limit) : Math.floor(tempIndex / limit) + 1;
          }
          console.log('page', page);
          var start = (page -1) * limit;
          var finish = start + limit;

          for (let index = start; index < finish && index < files.length; index++) {
              result.push(files[index]);
          }

          //create list page
          var listPage = [];
          if(page <= 5) {
            var temp = 1;
            for (let index = 1; index <= 10; index++) {
                listPage.push(temp);
                temp++;
            }
          } else if (page > maxPage - 6){
              var temp = maxPage - 9;
              for (let index = 1; index <= 10; index++) {
                listPage.push(temp);
                temp++;
            }
          } else {
              var temp = page - 4;
              for (let index = 1; index <= 10; index++) {
                listPage.push(temp);
                temp++;
            }
          }
          console.log(files[currentSourceIndex]);
          var data = {
            listPage: listPage,
            currentSource: files[currentSourceIndex],
            listResult: result,//.splice(1, result.length - 1),
            tableTitle: 'Trang ' + page,
            totalPage: maxPage,
            currentPage: page,
            limit: limit
        }
        res.render('index', data);
       });
    }catch
    {
        res.send("ERROR");
    }
});

router.get('/list', function (req, res) {
  try{
      console.log("List");
    fs.readdir('./Data/Fix/', (err, files) => {
        var data = {
            listAudio: lib.sortListFiles(files)
        };
        res.send(data);
     });
  }catch
  {
      res.send("ERROR");
  }
});

router.get('/', function (req, res) {
   res.redirect('/audio/?limit=10&page=1');
});



app.use('/', router);
//add the router
app.use(function(req, res, next){
  console.log(req.url);
  if(req.url.endsWith('.css/')){
    req.url = req.url.slice(0, req.url.length-1);
    console.log(req.url);
    next();
  }else if(req.url.endsWith('.js/')){
    req.url = req.url.slice(0, req.url.length-1);
    console.log(req.url);
    next();
  }else{
    res.render('notfound');
  }
});

app.use(express.static(path.join(__dirname, '/public')));
app.use('/audio', express.static(path.join(__dirname, '/public')));

app.set('views',path.join(__dirname, '/views'));
app.set('view engine', 'pug');
app.listen(process.env.port || 8888);

console.log('Running at Port http://localhost:8888/');

