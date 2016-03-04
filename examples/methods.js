var ansi   = require('../');
var cursor = ansi(process.stdout);

console.log(' AAAA AAAA AAAA AAAA AAAA');
console.log(' BBBB BBBB BBBB BBBB BBBB');
console.log(' CCCC CCCC CCCC CCCC CCCC');
console.log(' DDDD DDDD DDDD DDDD DDDD');
console.log(' EEEE EEEE EEEE EEEE EEEE');


cursor.move(5, -1).eraseLeft();//.write('====');
