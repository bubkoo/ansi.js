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
exports.Font = void 0;
var base_1 = require("./base");
var util_1 = require("./util");
var constants_1 = require("./constants");
var Font = /** @class */ (function (_super) {
    __extends(Font, _super);
    function Font(cursor) {
        var _this = _super.call(this, cursor) || this;
        _this.reset();
        return _this;
    }
    Font.prototype.reset = function () {
        this.isBold = false;
        this.isItalic = false;
        this.isInverse = false;
        this.isUnderline = false;
        return this;
    };
    return Font;
}(base_1.Base));
exports.Font = Font;
Object.keys(constants_1.fontStyles).forEach(function (styleName) {
    var propName = "is".concat((0, util_1.ucFirst)(styleName));
    var styleCode = constants_1.fontStyles[styleName];
    var resetCode = constants_1.fontResets[styleName];
    (0, util_1.extend)(Font, styleName, function () {
        if (this[propName]) {
            return this;
        }
        this.cursor.write(constants_1.prefix + styleCode + constants_1.suffix);
        this[propName] = true;
        return this;
    });
    (0, util_1.extend)(Font, "reset".concat((0, util_1.ucFirst)(styleName)), function () {
        if (!this[propName]) {
            return this;
        }
        this.cursor.write(constants_1.prefix + resetCode + constants_1.suffix);
        this[propName] = false;
        return this;
    });
});
//# sourceMappingURL=font.js.map