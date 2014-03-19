
#RAWHUB

Middleware for Express.js that allows the developer to get files from raw.github.com like they if they were local resources.

##Disclaimer

Please, remember that Github is NOT a CDN, and even though they can be used as one with a few lines of code (as this simple middleware shows), you should *NOT* be using this module on heavy production environments. 
If you do, bad things will happen to you, your hair will fall, your teeth turn yellow and you'll become impotent.
*You've been warned!*

##Install

```
$ npm install rawhub
```

##Usage

On the Node.js side, set up the middleware:

```javascript
var express = require("express");
var rawhub = require("rawhub");
var app = express();

app.use(rawhub.setUp({folder: '/rawhub'}));

```

Then, on the html side:

```html
<html>
  <head>
    <script src="/rawhub/deleteman/lfpr/master/public/javascripts/bootstrap.js"></script>
  <!-- ... -->
```

Basically, when setting up the middleware, you specify the fake local folder where your raw resources would be. Then on the html side, you referece those resources using that fake folder and the rest of the raw file's original url.
The middleware will map that to the original raw file url, download it and return it, but first, adding the correct content type.

##Cache
The middleware accepts cache options, so the resources don't have to be downloaded on every request from Github:

```javascript
app.use(rawhub.setUp({
  folder: '/rawhub', 
  cache: {
    folder: '/public/cache', //where the file will be stored
    ttl: 100 //seconds
  }
}));
```

#License
The MIT License (MIT)

Copyright (c) 2013 Fernando Doglio

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
