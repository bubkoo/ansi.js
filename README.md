# ansi.js

> ansi escape sequences for terminal cursor positioning and coloring.


[![MIT License](https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square)](https://github.com/bubkoo/ansi.js/blob/master/LICENSE)
 
[![NPM](https://nodei.co/npm/ansi.js.png)](https://nodei.co/npm/ansi.js/)
 

`ansi.js` provides many easy-to-use methods for writing ANSI escape codes to 
`Stream` instances. ANSI escape codes are used to do fancy things in a terminal 
window, such as, positioning the cursor, coloring the text, erasing characters, 
lines or even the entire window, or hide and show the cursor, and many others.


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

// You can chain your calls forever:
cursor
  .red()                 // set font color to red
  .bg.grey()             // set background color to grey
  .write('Hello World!') // write 'Hello World!' to stdout
  .bg.reset().end()      // reset the bgcolor before writing the trailing \n,
                         // `end()` for chain calling.
  .write('\n');          // add a final \n to wrap things up avoiding Terminal glitches

// Rendering modes are persistent:
cursor
  .hex('#660000')
  .bold()
  .underline();

// You can use the regular logging functions, text will be green:
console.log('This is blood red, bold text.');

// To reset just the foreground color:
cursor.fg.reset();

console.log('This will still be bold.');

// move the cursor to an absolute location (x,y)
// note: 1-indexed, not 0-indexed:
cursor
  .moveTo(10, 5)
  .write('Five down, ten over.');

// to clear the current line:
cursor
  .moveToColumn(0)
  .eraseLine()
  .write('Starting again');

// to go to a different column on the current line:
cursor
  .moveToColumn(5)
  .write('column five');

// clean up
cursor.reset();

```

## Constructor

```js
var ansi   = require('ansi.js');
var cursor = ansi(stream, options);
```

### stream

Any `Stream` instance, for terminal it would be `process.stdout`.

### options

 - `options.enabled` when `enabled` is false then all the methods are no-ops except for `write()`.
 - `options.buffering` when `buffering` is true, then `write()` calls are buffered in memory until `flush()` is invoked.

## Properties

### stream

The `Stream` instance.

### enabled

Passed by `options`, when `enabled` is false then all the methods are no-ops except for `write()`.

### buffering

Passed by `options`, when `buffering` is true, then `write()` calls are buffered in memory until `flush()` is invoked.

### fg(foreground)

Instance of `Colour`, provides many useful methods for setting foreground color.

#### Set by color names: `cursor.fg.white()`

Valid color names:

- black
- red
- green
- yellow
- blue
- magenta
- cyan
- white
- grey
- brightBlack
- brightRed
- brightGreen
- brightYellow
- brightBlue
- brightMagenta
- brightCyan
- brightWhite

#### Set by `rgb(r, g, b)`

Arguments are the values of color channels, should be `0-255`. 

#### Set by `hex(color)`

`color` is CSS color string, such as: `"#FF0000"`

**PS:** All the above methods of `bg` was attached on `cursor` with the same method name. And these methods are chainable:

```js
cursor
  .blue()
  .write('This is blue.')
  .green()
  .write('this is green.');

// with the `fg` property
cursor
  .fg.blue().end()
  .write('This is blue.')
  .fg.green().end()
  .write('this is green.');
```

#### `end()`

End the methods calling of `bg`, return `Cursor` instance for chain calling.

#### `reset()`

Reset the current foreground color to the default setting.

### bg(background)

Instance of `Colour`, provides many useful methods for setting background color.

### font

### display

### newlines

## Methods




## License

[MIT](https://github.com/bubkoo/ansi.js/blob/master/LICENSE) © bubkoo

