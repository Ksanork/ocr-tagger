'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DatasetImageSchema = new _mongoose2.default.Schema({
    path: {
        type: String,
        required: true,
        trim: true
    },
    width: {
        type: Number
    },
    height: {
        type: Number
    },
    dataset: {
        type: String
    },
    tag: {
        type: String,
        default: ''
    },
    taggedBy: {
        type: String,
        default: ''
    },
    problem: {
        type: String,
        default: ''
    }
});

var DatasetImage = _mongoose2.default.model('DatasetImage', DatasetImageSchema);
exports.default = DatasetImage;
//# sourceMappingURL=DatasetImageSchema.js.map