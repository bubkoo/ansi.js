# ansi.js

> ansi escape sequences for terminal cursor positioning and coloring.


[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/bubkoo/ansi.js/blob/master/LICENSE)
 
[![NPM](https://nodei.co/npm/ansi.js.png)](https://nodei.co/npm/ansi.js/)
 

`ansi.js` is a module for Node.js that provides an easy-to-use API for writing 
ANSI escape codes to `Stream` instances. ANSI escape codes are used to do fancy 
things in a terminal window, like render text in colors, delete characters, 
lines, the entire window, or hide and show the cursor, and lots more!


ref:
 - [https://en.wikipedia.org/wiki/ANSI_escape_code](https://en.wikipedia.org/wiki/ANSI_escape_code)
 - [http://ispltd.org/mini_howto:ansi_terminal_codes](http://ispltd.org/mini_howto:ansi_terminal_codes)
 - [http://www.termsys.demon.co.uk/vtansi.htm](http://www.termsys.demon.co.uk/vtansi.htm)


## Install
  
First make sure you have installed the latest version of [node.js](http://nodejs.org/) 
(You may need to restart your computer after this step).

Install with npm:

```
$ npm install ansi.js --save
```

## Usage

```js

var ansi   = require('ansi.js');
var cursor = ansi(process.stdout);



```

## Methods



## License

[MIT](https://github.com/bubkoo/ansi.js/blob/master/LICENSE) © bubkoo

