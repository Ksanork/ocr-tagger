'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ProblemSchema = new _mongoose2.default.Schema({
    description: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    }
});

var Problem = _mongoose2.default.model('Problem', ProblemSchema);

// Problem.create()

exports.default = Problem;
//# sourceMappingURL=ProblemSchema.js.map