var fs = require('fs');
var pg = require('pg');
var qs = require('querystring');


exports.index = function(req, res){

  fs.readdir('./data', function(err, tracks) {
    if (err) {
      res.render('index', { title: 'SHIT BROKE! ', tracks: [] });
    }
    else {
      res.render('index', { title: 'WeJammin', tracks: tracks});
    }
  });
};

var getFilename = function(callback) {
  fs.readdir('./data', function(err, tracks) {
    if (err) {
      callback(err, null);
    } else {
      var n = 1;
      while (tracks.indexOf('track_'+n) !== -1) {
        n++;
      }
      var filename = 'track_'+n;

      callback(null, filename);
    }
  });
};

var doUpload = function(err, filename, req, res) {
  if (err) {
    res.json({
      name: null,
      message: 'Shit broke!'
    });
    return false;
  }

  var stream = fs.createWriteStream('data/'+filename);

  req.on('data', function(data) {
    stream.write(data);
  });

  req.on('end', function () {
    res.json({
      name: filename
    });
  });
};

exports.postHandler = function(req, res){
  getFilename(function(err, tracks) {
    doUpload(err, tracks, req, res);
  });
};

exports.rename = function(req, res){
  var oldName = qs.parse(req._parsedUrl.query).trackName;
  console.log(oldName);
  var newName = qs.parse(req._parsedUrl.query).newName;
  fs.rename('./data/'+oldName, './data/'+newName, function(err, success){
    if(err) console.error(err);
  });
};

exports.delete = function(req, res){
  fs.unlink('./data/'+req.params.id, function(err, success){
    if(err) console.error(err);
    console.log("file deleted");
  });
};
