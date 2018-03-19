'use strict';

var _DBO = require('../models/DBO');

var _DBO2 = _interopRequireDefault(_DBO);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbo = new _DBO2.default(_config2.default.mongo_url);

// dbo.getDatasetsWithCounts((datasets) => {
//     datasets.forEach((dataset) => {
//        console.log(dataset.name + " - " + dataset.countAll);
//     });
// });

dbo.getNextDatasetImage("5ab01f20e539e13a606661ab", function (image) {
   console.log(image);
});

// dbo.checkIfUserExists("karol", (status) => {
//     console.log(status ? "istnieje" : "nie istnieje");
// });

// process.exit();
//# sourceMappingURL=get-datasets.js.map