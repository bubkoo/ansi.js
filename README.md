<h1 align="center">ansi.js</h1>

<p align="center"><strong>ansi escape sequences for terminal cursor positioning and coloring.</strong></p>

<p align="center">
<a href="/LICENSE"><img src="https://img.shields.io/badge/license-MIT_License-green.svg?style=flat-square" alt="MIT License"></a>
<a href="https://www.typescriptlang.org"><img alt="Language" src="https://img.shields.io/badge/language-TypeScript-blue.svg?style=flat-square"></a>
<a href="https://github.com/bubkoo/ansi.js/pulls"><img alt="PRs Welcome" src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg?style=flat-square"></a>
</p>

`ansi.js` provides many easy-to-use methods for writing ANSI escape codes to `Stream` instances. ANSI escape codes are used to do fancy things in a terminal window, such as, positioning the cursor, coloring the text, erasing characters, lines or even the entire window, or hide and show the cursor, and many others.


## Install

```
$ npm install ansi.js --save
```


## Usage

```js

const ansi   = require('ansi.js');
const cursor = ansi(process.stdout);

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
const ansi   = require('ansi.js');
const cursor = ansi(stream, options);
```

### stream

Any `Stream` instance, for terminal it would be `process.stdout`.


### options
- `enabled` - When `enabled` is `false` then all the methods are no-ops except for `forceWrite()`. Default `true`.
- `buffering` - When `buffering` is true, then `write()` calls are buffered in memory until `flush()` is invoked. Default `false`.
- `lineTrack` - Keep track of the number of `lineCount` that get encountered. Default `false`.


## Properties

- `stream` - The `Stream` instance.
- `enabled` - Passed by `options`, when `enabled` is `false` then all the methods are no-ops except for `forceWrite()`.
- `buffering` - Passed by `options`, when `buffering` is `true`, then `write()` calls are buffered in memory until `flush()` is invoked.
- `lineCount` - The number of new line that get encountered when `options.lineTrack` is `true`.
- `foreground` - Instance of `Color`, provides many useful methods for setting foreground color.
  ```js
  cursor
    .blue()
    .write('This is blue.')
    .green()
    .write('this is green.');

  // same with the `foreground` property
  cursor
    .foreground.blue().end()
    .write('This is blue.')
    .foreground.green().end()
    .write('this is green.');
  ```
- `background` - Instance of `Color`, provides many useful methods for setting background color. 
This property has all the same methods of `foreground`, but these methods are not be 
attached on `Curosr` instance, you can use it like this:
  ```js
  cursor
    .background.blue().end()
    .write('This background is blue.')
    .background.green().end()
    .write('this background is green.');
  ```
- `font` - Instance of `Font`, for setting font styles with these methods:
  - bold()
  - italic()
  - underline()
  - inverse()
  - resetBold()
  - resetItalic()
  - resetUnderline()
  - resetInverse()
  - end()

  And these methods are attached on `Curosr` instance:

  ```is
  cursor
    .font.bold().italic().end()
    .write('This will be bold and italic.')
    .resetItalic()
    .underline()
    .write('This will be bold and underline.');
  ```


- `display` - Instance of `Display`, setting the display mode with the these methods:
  - dim()
  - blink()
  - hidden()
  - bright()
  - reverse()
  - underscore()
  - reset()

## Methods


- `enable()` & `disable()` - Update the `cursor.enabled`, When `cursor.enabled` is false then all the methods are no-ops except for `forceWrite()`.
- `write(data)` - Helper method that calls `forceWrite()` when `enabled` is `true`.
- `buffer()` - Set `cursor.buffering` truly, when `cursor.buffering` is `true`, then `write()` calls are buffered in memory until `flush()` is invoked.
- `flush()` - Write out the in-memory buffer, then set `cursor.buffering` falsely.
- `move(x, y)` - Move the cursor position by the relative coordinates `x`, `y`.
- `moveTo(x, y)` - Set the cursor position to the absolute coordinates `x`, `y`.
- `moveUp(count)` - Move the cursor up by `count` (default `1`) rows.
- `moveDown(count)` - Move the cursor down by `count` (default `1`) rows.
- `backward(count)` - Move the cursor backward by `count` (default `1`) columns.
- `forward(count)` - Move the cursor forward by `count` (default `1`) columns.
- `nextLine(n)` - Move cursor to beginning of the line `n` (default `1`) lines down.
- `prevLine(n)` - Move cursor to beginning of the line `n` (default `1`) lines up.
- `moveToColumn(n)` - Moves the cursor to column `n` (default `1`).
- `scrollUp(n)` - Scroll whole page up by `n` (default `1`) lines. New lines are added at the bottom.
- `scrollDown()` - Scroll whole page down by `n` (default `1`) lines. New lines are added at the top.
- `erase(type)` - Clear part of the screen or line defined by the string `type`:
  - end - clear from the cursor to the end of the line
  - start - clear from the cursor to the start of the line
  - line - clear the current line
  - down - clear everything below the current line
  - up - clear everything above the current line
  - screen - clear the entire screen
- `eraseRight()` - Clear from cursor to the end of the line. Cursor position does not change.
- `eraseLeft()` - Clear from cursor to the start of the line. Cursor position does not change.
- `eraseLine()` - Clear the current line. Cursor position does not change.
- `eraseUp()` - Clear from cursor to beginning of the screen.
- `eraseDown()`- Clear from cursor to end of screen.
- `eraseScreen()` - Clear entire screen. And moves cursor to upper left on DOS.
- `delete(mode, n)` - Delete 'line' or 'char's. `delete` differs from `erase` because it does not write over the deleted characters with whitesapce, but instead removes the deleted space. `mode` can be `'line'` or `'char'`. `n` is the number of items to be deleted. And `n` must be a positive integer. **Node: the cursor position is not updated after deletion**.
- `deleteLine(n)`
- `deleteChar(n)`
- `insert(mode, n)` - Insert space into the terminal. `insert` is the opposite of `delete`, and the arguments are the same.
- `beep()` - Play a beeping sound.
- `show()` & `hide()` - Show/Hide the cursor.
- `save(withAttributes)` & `restore(withAttributes)` - Save/Restore the cursor position and optionally the attribute state.
- `reset()` - Reset all terminal settings to default.


### Attached methods of `foreground` property

These methods are used for setting the foreground color.

- black()
- red()
- green()
- yellow()
- blue()
- magenta()
- cyan()
- white()
- grey()
- brightBlack()
- brightRed()
- brightGreen()
- brightYellow()
- brightBlue()
- brightMagenta()
- brightCyan()
- brightWhite()
- rgb(r, g, b)
- hex(color)


### Attached methods of `font` property

These methods are used for setting the font style.

- bold()
- italic()
- underline()
- inverse()
- resetBold()
- resetItalic()
- resetUnderline()
- resetInverse()


### Attached methods of `display` property

These methods are used for setting the display mode.

- dim()
- blink()
- hidden()
- bright()
- reverse()
- underscore()


## Contributing

Please let us know how can we help. Do check out [issues](https://github.com/bubkoo/ansi.js/issues) for bug reports or suggestions first.

To become a contributor, please follow our [contributing guide](/CONTRIBUTING.md).

<a href="https://github.com/bubkoo/ansi.js/graphs/contributors">
  <img src="/CONTRIBUTORS.svg" alt="Contributors" width="740" />
</a>


## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)

