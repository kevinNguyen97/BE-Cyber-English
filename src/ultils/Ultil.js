"use strict";
exports.__esModule = true;
exports.toPlural = exports.toSingular = exports.removeParenthesesBrackets = exports.getRandomInt = exports.getRandomFloat = void 0;
var constants_1 = require("../constants");
var getRandomFloat = function (max, min) {
    if (min === void 0) { min = 0; }
    return Math.random() * (max - min) + min;
};
exports.getRandomFloat = getRandomFloat;
var getRandomInt = function (max, min) {
    if (min === void 0) { min = 0; }
    var _min = Math.ceil(min);
    var _max = Math.floor(max);
    return Math.floor(Math.random() * (_max - _min) + _min);
};
exports.getRandomInt = getRandomInt;
var removeParenthesesBrackets = function (str) {
    return str.replace(constants_1.regex.bracketParentheses, "").trim();
};
exports.removeParenthesesBrackets = removeParenthesesBrackets;
var toSingular = function (_str) {
    var str = _str;
    if (constants_1.uncountable.indexOf(str.toLowerCase()) >= 0)
        return str;
    for (var _i = 0, _a = Object.keys(constants_1.irregular); _i < _a.length; _i++) {
        var word = _a[_i];
        var pattern = new RegExp(constants_1.irregular[word] + "$", "i");
        var replace = word;
        if (pattern.test(str))
            return str.replace(pattern, replace);
    }
    for (var _b = 0, _c = Object.keys(constants_1.singular); _b < _c.length; _b++) {
        var reg = _c[_b];
        var pattern = new RegExp(reg, "i");
        if (pattern.test(str))
            return str.replace(pattern, constants_1.singular[reg]);
    }
    return str;
};
exports.toSingular = toSingular;
var toPlural = function (_str) {
    var str = _str;
    if (constants_1.uncountable.indexOf(str.toLowerCase()) >= 0)
        return str;
    for (var _i = 0, _a = Object.keys(constants_1.irregular); _i < _a.length; _i++) {
        var item = _a[_i];
        var pattern = new RegExp(item + "$", "i");
        var replace = constants_1.irregular[item];
        if (pattern.test(str))
            return str.replace(pattern, replace);
    }
    for (var _b = 0, _c = Object.keys(constants_1.plural); _b < _c.length; _b++) {
        var reg = _c[_b];
        var pattern = new RegExp(reg, "i");
        if (pattern.test(str))
            return str.replace(pattern, constants_1.plural[reg]);
    }
    return str;
};
exports.toPlural = toPlural;
console.log(exports.toSingular("pages"));
console.log(exports.toPlural("page"));
