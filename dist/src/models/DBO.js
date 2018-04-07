'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _UserSchema = require('./schemas/UserSchema');

var _UserSchema2 = _interopRequireDefault(_UserSchema);

var _DatasetSchema = require('./schemas/DatasetSchema');

var _DatasetSchema2 = _interopRequireDefault(_DatasetSchema);

var _DatasetImageSchema = require('./schemas/DatasetImageSchema');

var _DatasetImageSchema2 = _interopRequireDefault(_DatasetImageSchema);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DBO = function () {
    function DBO(url) {
        _classCallCheck(this, DBO);

        _mongoose2.default.connect(url);
        console.log("połączono z bazą danych: " + url);
    }

    _createClass(DBO, [{
        key: 'addUser',
        value: function addUser(name, password, isAdmin, callback) {
            _UserSchema2.default.create({
                name: name,
                password: password,
                isAdmin: isAdmin
            }, function (err, user) {
                // console.log("callback");
                if (err) {
                    console.log("add user - error");
                    callback(false);
                } else {
                    console.log("Dodano usera - " + user.name);
                    callback(true);
                }
            });
        }
    }, {
        key: 'addDataset',
        value: function addDataset(name, desc, callback) {
            _DatasetSchema2.default.create({
                name: name,
                description: desc
            }, function (err, dataset) {
                // console.log("callback");
                if (err) {
                    console.log("add dataset - error");
                    callback(false, dataset);
                } else {
                    console.log("Dodano dataset - " + dataset.name);
                    callback(true, dataset);
                }
            });
        }
    }, {
        key: 'addDatasetImage',
        value: function addDatasetImage(path, dataset_id, width, height, callback) {
            _DatasetImageSchema2.default.create({
                path: path,
                dataset: dataset_id,
                width: width,
                height: height
            }, function (err, user) {
                // console.log("callback");
                if (err) {
                    console.log("add dataset-iamge - error");
                    callback(false);
                } else {
                    console.log("Dodano dataset-iamge  - " + user.path);
                    callback(true);
                }
            });
        }
    }, {
        key: 'getDatasetsWithCounts2',
        value: function getDatasetsWithCounts2(callback) {
            var that = this;
            _DatasetSchema2.default.find({}, function (err, datasets) {
                if (err) console.log("problem z getDatasets2");else {
                    console.log("------ get datasets2 ---");

                    // let di = [];


                    console.log("length " + datasets.length);
                    var j = 0;

                    datasets.forEach(function (dataset, i) {
                        that.getOneDatasetsWithCounts(dataset._id, function (dataset) {
                            j++;
                            if (j == datasets.length - 1) callback(datasets);
                        });
                    });
                }
            });
        }
    }, {
        key: 'getDatasetsWithCounts',
        value: function getDatasetsWithCounts(callback) {
            var that = this;
            _DatasetSchema2.default.find({}, function (err, datasets) {
                if (err) console.log("problem z getDatasets");else {
                    console.log("------ get datasets ---");

                    var di = [];

                    console.log("length " + datasets.length);

                    if (datasets.length == 0) {
                        console.log("callback 1");
                        callback(datasets);
                        return;
                    }

                    var j = 0;
                    datasets.forEach(function (dataset, i) {
                        var all = 0,
                            tagged = 0;

                        // console.log(dataset._id);
                        that.getAllCountsOfDataset(dataset._id, function (count) {
                            all = count;

                            that.getTaggedCountsOfDataset(dataset._id, function (count) {
                                tagged = count;

                                di.push({
                                    countAll: all,
                                    countTagged: tagged
                                });

                                dataset.countAll = all;
                                dataset.countTagged = tagged;

                                if (j++ == datasets.length - 1) {
                                    console.log("callback 2");

                                    callback(datasets);
                                    return;
                                }
                                console.log(dataset.name + " - " + tagged + "/" + all);
                            });
                        });
                    });
                }
            });
        }
    }, {
        key: 'addTag',
        value: function addTag(datasetImage_id, user_id, tag, callback) {
            _DatasetImageSchema2.default.update({
                _id: datasetImage_id
            }, {
                tag: tag,
                taggedBy: user_id
            }, function (err, raw) {
                if (err) {
                    callback(false);
                } else callback(true);
            });
        }
    }, {
        key: 'getOneDatasetsWithCounts',
        value: function getOneDatasetsWithCounts(dataset_id, callback) {
            var that = this;
            _DatasetSchema2.default.findOne({
                _id: dataset_id
            }, function (err, dataset) {
                if (err) console.log("problem z getDatasets");else {
                    // console.log(datasets);

                    // if(datasets.length == 0) {
                    //     callback(datasets);
                    //     return;
                    // }
                    // datasets.forEach((dataset, i) => {
                    var all = 0,
                        tagged = 0;

                    // console.log(dataset._id);
                    that.getAllCountsOfDataset(dataset._id, function (count) {
                        all = count;

                        that.getTaggedCountsOfDataset(dataset._id, function (count) {
                            tagged = count;

                            dataset.countAll = all;
                            dataset.countTagged = tagged;

                            // if(i == datasets.length-1)
                            callback(dataset);
                            console.log(dataset.name + " - " + tagged + "/" + all);
                        });
                    });
                }

                // }
            });
        }
    }, {
        key: 'getNextDatasetImage',
        value: function getNextDatasetImage(dataset_id, callback) {
            _DatasetImageSchema2.default.findOne({
                dataset: dataset_id,
                tag: '',
                problem: ''
            }, function (err, datasetImage) {
                if (err) throw err;

                callback(datasetImage);
            });
        }
    }, {
        key: 'getAllCountsOfDataset',
        value: function getAllCountsOfDataset(dataset_id, callback) {
            _DatasetImageSchema2.default.find({
                dataset: dataset_id
            }, function (err, datasets) {
                if (err) {
                    console.log("agetAllCountsOfDataset - error");
                    callback(-1);
                } else {
                    callback(datasets.length);
                }
            });
        }
    }, {
        key: 'getTaggedCountsOfDataset',
        value: function getTaggedCountsOfDataset(dataset_id, callback) {
            _DatasetImageSchema2.default.find({
                dataset: dataset_id,
                $or: [{ tag: { $ne: "" } }, { problem: { $ne: "" } }]
            }, function (err, datasets) {
                if (err) {
                    console.log("getTaggedCountsOfDataset - error");
                    callback(-1);
                } else {
                    callback(datasets.length);
                }
            });
        }
    }, {
        key: 'checkIfUserExists',
        value: function checkIfUserExists(name, callback) {
            _UserSchema2.default.findOne({
                name: name
            }, function (err, user) {
                if (err || !user) {
                    callback(false);
                    return;
                } else callback(true);
            });
        }
    }, {
        key: 'checkAuth',
        value: function checkAuth(name, password, callback) {
            _UserSchema2.default.findOne({
                name: name
            }, function (err, user) {
                if (err || !user) {
                    callback(false, user);
                    return;
                }

                _bcrypt2.default.compare(password, user.password, function (err, res) {
                    if (res) {
                        callback(true, user);
                    } else {
                        callback(false, user);
                    }
                });
            });
        }
    }, {
        key: 'removeAll',
        value: function removeAll(callback) {
            console.log("remove all");
            _UserSchema2.default.remove({}, function (err) {
                if (err) console.log("problem z usuwaniem");else {
                    console.log("usuwanie userów ok");
                    callback();
                }
            });

            _DatasetSchema2.default.remove({}, function (err) {
                if (err) console.log("problem z usuwaniem");else {
                    console.log("usuwanie datasetów ok");
                    callback();
                }
            });

            _DatasetImageSchema2.default.remove({}, function (err) {
                if (err) console.log("problem z usuwaniem");else {
                    console.log("usuwanie obrazów ok");
                    callback();
                }
            });
        }
    }]);

    return DBO;
}();

exports.default = DBO;
//# sourceMappingURL=DBO.js.map