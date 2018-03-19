'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DatasetSchema = new _mongoose2.default.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
});

var Dataset = _mongoose2.default.model('Dataset', DatasetSchema);
exports.default = Dataset;
//# sourceMappingURL=DatasetSchema.js.map