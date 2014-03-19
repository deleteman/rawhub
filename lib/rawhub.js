var request = require("request"),
    mime = require("mime"),
    crypto = require("crypto"),
    fs = require("fs");

var GITHUB_RAW_HOST = "http://raw.github.com";

function RawHub ( opts ) {
  this.options = opts;
  this.cache = false;
  if( this.options.cache ) {
    this.cache = true;
  }
}

RawHub.prototype.checkFolder = function(url) {
  return url.indexOf(this.options.folder) != -1;
};

RawHub.prototype.getResource = function(url, cb) {
  var newUrl = url.replace(this.options.folder, GITHUB_RAW_HOST);
  if(this.cache) {
    if(this.isCacheValid(newUrl)) {
      this.readFromDisk(newUrl, cb);
    } else {
      this.downloadResource(newUrl, cb);
    }
  } else {
    this.downloadResource(newUrl, cb);
  }

}

RawHub.prototype.downloadResource = function (newUrl, cb) {
  var self = this;
console.log("Downloading resource again!");
  request(newUrl, function(err, contentRes, body) {
    if(err) {
      console.log("Error getting Github raw data from '" + newUrl + "'::" + err);
      cb({errorCode: 500, error: err});
    } else {
      if(self.options.cache) { 
        self.cacheFile(newUrl);
      }
      cb(null, body);
    }
  })
};

RawHub.prototype.getMimeType = function(filename) {
  return mime.lookup(filename);
}

RawHub.prototype.readFromDisk = function(url, cb) {
  var filename = this.getCacheFilename(url); 
  fs.readFile(process.cwd() + "/" + this.options.cache.folder + "/" + filename , function(err, data) {
    cb(err, data)
  });
};

RawHub.prototype.getCacheFilename = function(url) {
  var fileparts = url.split(".");
  var ext = fileparts[fileparts.length - 1]
  return crypto.createHash("md5").update(url).digest("hex") + "." + ext;
}
RawHub.prototype.isCacheValid = function(url) {
  var fname = this.getCacheFilename(url);
  var cacheFilePath = process.cwd() + "/" + this.options.cache.folder + "/" + fname;
  if( fs.existsSync(cacheFilePath) ) {
    var cacheStats = fs.statSync(cacheFilePath);
    var currentTimeStamp = new Date().getTime();
    var cachedTimeStamp = new Date(cacheStats.mtime).getTime();
    
    return (cachedTimeStamp + this.options.cache.ttl) > currentTimeStamp;
  } else {
    return false;
  }
}

RawHub.prototype.cacheFile = function(url, content) {
  var fname = this.getCacheFilename(url);
  var cacheFilePath = process.cwd() + this.options.cache.folder + "/" + fname;
  fs.writeFileSync(cacheFilePath, content); 
}

module.exports = {
  /**
    Returns the middleware function that takes care of adding the correct content-type
  */
  setUp: function(opts) {
    var rawH = new RawHub(opts);
    return function(req, res, next) {
      var url = req.url;
      if(rawH.checkFolder(url) ) {
        rawH.getResource(url, function(err, fileContent) {
          if(err) {
            res.send(err.errorCode, err.error);
          } else {
            res.header("Content-type", rawH.getMimeType(url));
            res.send(200, fileContent);
          }
        });
        
      } else {
        return next();
      }
      
    };
  }
};
