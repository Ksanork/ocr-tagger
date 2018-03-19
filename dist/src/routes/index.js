'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _DBO = require('../models/DBO');

var _DBO2 = _interopRequireDefault(_DBO);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var dbo = new _DBO2.default(_config2.default.mongo_url);

var Storage = _multer2.default.diskStorage({
    destination: function destination(req, file, callback) {
        callback(null, "dataset-images");
    },

    filename: function filename(req, file, callback) {
        var filename = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, filename);
    }
});

var upload = (0, _multer2.default)({
    storage: Storage
}).single('file');

var authorise = function authorise(req, res, next) {
    if (req.session.auth && req.session.authUser) {
        dbo.getDatasetsWithCounts(function (datasets) {
            res.render('panel', { username: req.session.authUser, isAdmin: req.session.isAdmin, datasets: datasets });
        });
        // next();
        // res.render("panel", { username: req.session.authUser, isAdmin: req.session.isAdmin });
    } else {
        next();
    }
};

router.get('/', authorise, function (req, res) {
    res.render("login");
});

router.get('/register', authorise, function (req, res) {
    res.render("register");
});

router.post("/login", authorise, function (req, res, next) {
    if (dbo.checkAuth(req.body.name, req.body.password, function (status, user) {
        if (status) {
            req.session.auth = true;
            req.session.authUser = user.name;
            req.session.isAdmin = user.isAdmin;
            req.session.userId = user._id;

            console.log("auth ok - " + req.session.authUser);

            dbo.getDatasetsWithCounts(function (datasets) {
                res.render('panel-partial', { username: user.name, isAdmin: user.isAdmin, datasets: datasets }, function (err, output) {
                    console.log("res");
                    res.json(JSON.stringify({ status: "true", html: output }));
                });
            });
        } else {
            res.json(JSON.stringify({ status: "false" }));
        }
    })) ;
});

router.post("/new-register", authorise, function (req, res, next) {
    dbo.checkIfUserExists(req.body.name, function (result) {
        if (!result) {
            dbo.addUser(req.body.name, req.body.password, false, function (status) {
                res.render('register-confirm', { status: status }, function (err, output) {
                    res.json(JSON.stringify({ html: output }));
                });
            });
        } else {
            res.json(JSON.stringify({ status: "user-exists", html: null }));
        }
    });
});

/*

    Panel

 */

router.post('/open-add-dataset', function (req, res) {
    res.render('add-dataset', function (err, output) {
        res.json(JSON.stringify({ html: output }));
    });
});

router.post('/add-dataset', function (req, res) {
    dbo.addDataset(req.body.name, req.body.desc, function (status, dataset) {
        if (status) {
            res.json(JSON.stringify({ status: "true", dataset_id: dataset._id }));
        }
    });
});

router.post("/add-dataset-image", function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
        } else {
            var path = "dataset-images/" + req.body.dataset_id;
            if (!_fs2.default.existsSync(path)) {
                _fs2.default.mkdirSync(path);
            }

            console.log(req.file.path + " => " + path + " - " + req.file.filename);

            _fs2.default.rename(req.file.path, path + "/" + req.file.filename, function (err) {
                if (err) throw err;else console.log('Successfully moved');
            });

            dbo.addDatasetImage(path + "/" + req.file.filename, req.body.dataset_id, function (status) {});
            res.sendStatus(200);
        }
    });
});

router.post("/get-datasets", function (req, res) {
    dbo.getDatasetsWithCounts(function (datasets) {
        res.render('datasets-partial', { datasets: datasets }, function (err, output) {
            res.json(JSON.stringify({ html: output }));
        });
    });
});

router.post("/get-dataset-image", function (req, res) {
    dbo.getNextDatasetImage(req.body.dataset_id, function (datasetImage) {
        dbo.getOneDatasetsWithCounts(req.body.dataset_id, function (dataset) {
            res.render('tagging', {
                dataset: dataset.name,
                datasetImage_id: datasetImage._id,
                path: datasetImage.path,
                countTagged: dataset.countTagged,
                countAll: dataset.countAll
            }, function (err, output) {
                res.json(JSON.stringify({ html: output }));
            });
        });
    });
});

router.post("/add-tag", function (req, res) {
    dbo.addTag(req.body.datasetImage_id, req.session.userId, req.body.tag, function (status) {
        if (status) res.send("true");
    });
});

exports.default = router;
//# sourceMappingURL=index.js.map