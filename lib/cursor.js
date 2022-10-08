"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = void 0;
var on_new_line_1 = __importDefault(require("on-new-line"));
var font_1 = require("./font");
var color_1 = require("./color");
var display_1 = require("./display");
var util_1 = require("./util");
var constants_1 = require("./constants");
var Cursor = /** @class */ (function () {
    function Cursor(stream, options) {
        if (options === void 0) { options = {}; }
        var _this = this;
        if (typeof stream !== 'object' || typeof stream.write !== 'function') {
            throw new Error('A valid Stream instance must be passed in.');
        }
        this.stream = stream;
        this.font = new font_1.Font(this);
        this.display = new display_1.Display(this);
        this.foreground = new color_1.Color(this, 0);
        this.background = new color_1.Color(this, 10);
        var enabled = options.enabled;
        if (typeof enabled === 'undefined') {
            enabled = stream.isTTY;
        }
        this.enabled = enabled !== false;
        // when `buffering` is true, then `write()` calls are buffered
        // in memory until `flush()` is invoked.
        this.buffering = options.buffering === true;
        this.bufferData = [];
        // keep track of the number of `newline` that get encountered
        if (options.lineTrack === true) {
            this.lineCount = 0;
            (0, on_new_line_1.default)(stream);
            stream.on('newline', function () {
                _this.lineCount += 1;
            });
        }
    }
    Cursor.prototype.enable = function () {
        this.enabled = true;
        return this;
    };
    Cursor.prototype.disable = function () {
        this.enabled = false;
        return this;
    };
    Cursor.prototype.writeIn = function (data) {
        if (this.buffering) {
            this.bufferData.push(data);
        }
        else {
            this.stream.write(data);
            this.stream.emit('data', data);
        }
        return this;
    };
    Cursor.prototype.write = function (data) {
        if (this.enabled) {
            this.writeIn(data);
        }
        return this;
    };
    Cursor.prototype.buffer = function () {
        this.buffering = true;
        return this;
    };
    Cursor.prototype.flush = function () {
        this.buffering = false;
        var output = this.bufferData.join('');
        // clean
        this.bufferData.length = 0;
        return this.writeIn(output);
    };
    Cursor.prototype.rgb = function (r, g, b) {
        this.foreground.rgb(r, g, b);
        return this;
    };
    Cursor.prototype.hex = function (color) {
        this.foreground.hex(color);
        return this;
    };
    /**
     * Move the cursor position by the relative coordinates `dx`and `dy`.
     */
    Cursor.prototype.move = function (dx, dy) {
        // set relative coordinates
        if (dy < 0) {
            this.moveUp(-dy);
        }
        else if (dy > 0) {
            this.moveDown(dy);
        }
        if (dx > 0) {
            this.forward(dx);
        }
        else if (dx < 0) {
            this.backward(-dx);
        }
        return this;
    };
    Cursor.prototype.beep = function () {
        return this.write(constants_1.beep);
    };
    Cursor.prototype.erase = function (type) {
        if (type) {
            if (type === '$') {
                return this.eraseRight();
            }
            if (type === '^') {
                return this.eraseLeft();
            }
            var methodName = "erase".concat((0, util_1.ucFirst)("".concat(type)));
            if (this[methodName]) {
                return this[methodName]();
            }
        }
        this.stream.emit('error', new Error("Unknown erase type: ".concat(type)));
        return this;
    };
    Cursor.prototype.delete = function (type, n) {
        if (type) {
            var methodName = "delete".concat((0, util_1.ucFirst)("".concat(type)));
            if (this[methodName]) {
                return this[methodName](n);
            }
        }
        this.stream.emit('error', new Error("Unknown delete type: ".concat(type)));
        return this;
    };
    Cursor.prototype.insert = function (mode, n) {
        if (n === void 0) { n = 1; }
        if (mode === true) {
            return this.write("".concat(constants_1.prefix, "4h"));
        }
        if (mode === false) {
            return this.write("".concat(constants_1.prefix, "l"));
        }
        if (mode === 'line') {
            return this.write("".concat(constants_1.prefix + n, "L"));
        }
        if (mode === 'char') {
            return this.write("".concat(constants_1.prefix + n, "@"));
        }
        this.stream.emit('error', new Error("Unknown insert type: ".concat(mode)));
        return this;
    };
    Cursor.prototype.save = function (withAttributes) {
        var code = constants_1.prefix + (withAttributes ? constants_1.codes.saveCursor : constants_1.codes.savePosition);
        return this.write(code);
    };
    Cursor.prototype.restore = function (withAttributes) {
        var code = constants_1.prefix + (withAttributes ? constants_1.codes.restoreCursor : constants_1.codes.restorePosition);
        return this.write(code);
    };
    /**
     * Reset all terminal settings to default
     */
    Cursor.prototype.reset = function () {
        this.font.reset();
        this.foreground.reset();
        this.background.reset();
        this.display.reset();
        this.write(constants_1.codes.resetDevice);
        this.write(constants_1.prefix + constants_1.displayTypes.reset + constants_1.suffix);
        return this;
    };
    return Cursor;
}());
exports.Cursor = Cursor;
Object.keys(constants_1.movements).forEach(function (movement) {
    var code = constants_1.movements[movement];
    (0, util_1.extend)(Cursor, movement, function () {
        var axis = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            axis[_i] = arguments[_i];
        }
        var c;
        if (axis.length === 1 || axis.length === 0) {
            c = axis[0] == null ? 1 : axis[0];
        }
        else {
            c = axis.map(util_1.toAxis).join(';');
        }
        return this.write(constants_1.prefix + c + code);
    });
});
Object.keys(constants_1.actions).forEach(function (action) {
    var code = constants_1.actions[action];
    (0, util_1.extend)(Cursor, action, function () {
        return this.write(constants_1.prefix + code);
    });
});
Object.keys(constants_1.colors).forEach(function (color) {
    (0, util_1.extend)(Cursor, color, function () {
        this.foreground[color]();
        return this;
    });
});
Object.keys(constants_1.fontStyles).forEach(function (styleName) {
    (0, util_1.extend)(Cursor, styleName, function () {
        this.font[styleName]();
        return this;
    });
    var resetName = "reset".concat((0, util_1.ucFirst)(styleName));
    (0, util_1.extend)(Cursor, resetName, function () {
        this.font[resetName]();
        return this;
    });
});
//# sourceMappingURL=cursor.js.map