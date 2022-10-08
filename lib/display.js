"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
var base_1 = require("./base");
var util_1 = require("./util");
var constants_1 = require("./constants");
var Display = /** @class */ (function (_super) {
    __extends(Display, _super);
    function Display(cursor) {
        var _this = _super.call(this, cursor) || this;
        _this.current = null;
        return _this;
    }
    Display.prototype.set = function (code) {
        if (this.current !== code) {
            this.current = code;
            this.cursor.write("".concat(constants_1.prefix).concat(code).concat(constants_1.suffix));
        }
        return this;
    };
    return Display;
}(base_1.Base));
exports.Display = Display;
Object.keys(constants_1.displayTypes).forEach(function (type) {
    var code = constants_1.displayTypes[type];
    (0, util_1.extend)(Display, type, function () {
        return this.set(code);
    });
});
//# sourceMappingURL=display.js.map