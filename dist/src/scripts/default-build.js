'use strict';

var _DBO = require('../models/DBO');

var _DBO2 = _interopRequireDefault(_DBO);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbo = new _DBO2.default(_config2.default.mongo_url);

dbo.removeAll(function () {
    // console.log("?");
    dbo.addUser("admin", "admin", true, function () {});
});

// dbo.checkIfUserExists("karol", (status) => {
//     console.log(status ? "istnieje" : "nie istnieje");
// });

// process.exit();
//# sourceMappingURL=default-build.js.map