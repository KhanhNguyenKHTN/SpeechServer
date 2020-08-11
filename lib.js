var https = require('https');
var fs = require('fs');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

exports.downloadAudio = function(dir, fileName, url)
{
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    var path = dir + '/' + fileName;
    var file = fs.createWriteStream(path);
    https.get(url, function(response) {
        response.pipe(file).on('finish', ()=>{
          var path2 = "Data/Fix/" + fileName;
          ffmpeg(path).audioCodec('copy').output(path2).on('error', function(err) {
            console.log('An error occurred: ' + err.message);
          }).run();
        });
    });
}

exports.removeUniCode = function RemoveUniCode(target) {
    var temp = target.replace(' ','');
    var data = {
      a: 'ạảãàáâậầấẩẫăắằặẳẵ',
      o: 'óòọõỏôộổỗồốơờớợởỡ',
      e: 'éèẻẹẽêếềệểễ',
      u: 'úùụủũưựữửừứ',
      i: 'íìịỉĩ',
      y: 'ýỳỷỵỹ',
      d: 'đ',
      A: 'ẠẢÃÀÁÂẬẦẤẨẪĂẮẰẶẲẴ',
      O: 'ÓÒỌÕỎÔỘỔỖỒỐƠỜỚỢỞỠ',
      E: 'ÉÈẺẸẼÊẾỀỆỂỄ',
      U: 'ÚÙỤỦŨƯỰỮỬỪỨ',
      I: 'ÍÌỊỈĨ',
      Y: 'ÝỲỶỴỸ',
      D: 'Đ'
    }
    Object.keys(data).map(function(key){
      var rep = Array.from(data[key]);
      rep.forEach(element => {
        temp = temp.replace(element, key);
      });
    });
 
    // target.replace('.','');
    // target.replace('_','');
    // target.replace('-','');
    // target.replace(':','');
    return temp;
  };