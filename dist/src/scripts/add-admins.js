'use strict';

var _DBO = require('../models/DBO');

var _DBO2 = _interopRequireDefault(_DBO);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
    node dist/src/scripts/add-admins.js
 */

var dbo = new _DBO2.default(_config2.default.mongo_url);

dbo.addUser("admin", "admin");

// process.exit();
//# sourceMappingURL=add-admins.js.map