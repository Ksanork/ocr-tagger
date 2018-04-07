'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _DBO = require('../models/DBO');

var _DBO2 = _interopRequireDefault(_DBO);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbo = new _DBO2.default(_config2.default.mongo_url);

dbo.removeAll(function () {
    dbo.addUser("admin", "admin", true, function () {});

    deleteFolderRecursive("../../../dataset-images");
    _fs2.default.mkdirSync("../../..//dataset-images");

    dbo.addNewProblem("Obraz jest źle przycięty", "Zgłoś źle przycięte zdjęcie", function () {});
    dbo.addNewProblem("Obraz jest nieczytelny", "Zgłoś nieczytelne zdjęcie", function () {});
    dbo.addNewProblem("Obraz nie pasuje do zbioru", "Zgłoś niepasujące zdjęcie", function () {});
});

function deleteFolderRecursive(path) {
    if (_fs2.default.existsSync(path)) {
        _fs2.default.readdirSync(path).forEach(function (file, index) {
            var curPath = path + "/" + file;

            console.log(curPath);
            if (_fs2.default.lstatSync(curPath).isDirectory()) {
                // recurse
                deleteFolderRecursive(curPath);
            } else {
                // delete file
                _fs2.default.unlinkSync(curPath);
            }
        });
        _fs2.default.rmdirSync(path);
    }
};
//# sourceMappingURL=default-build.js.map