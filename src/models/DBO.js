import mongoose from 'mongoose';
import User from './schemas/UserSchema';
import Dataset from './schemas/DatasetSchema';
import DatasetImage from './schemas/DatasetImageSchema';
import bcrypt from 'bcrypt';

export default class DBO {
    constructor(url) {
        mongoose.connect(url);
        console.log("połączono z bazą danych: " + url);
    }

    addUser(name, password, isAdmin, callback) {
        User.create({
            name: name,
            password: password,
            isAdmin: isAdmin
        }, (err, user) => {
            // console.log("callback");
            if(err) {
                console.log("add user - error");
                callback(false);
            }
            else {
                console.log("Dodano usera - " + user.name);
                callback(true);
            }
        });
    }

    addDataset(name, desc, callback) {
        Dataset.create({
            name: name,
            description: desc
        }, (err, dataset) => {
            // console.log("callback");
            if(err) {
                console.log("add dataset - error");
                callback(false, dataset);
            }
            else {
                console.log("Dodano dataset - " + dataset.name);
                callback(true, dataset);
            }
        });
    }

    addDatasetImage(path, dataset_id, width, height, callback) {
        DatasetImage.create({
            path: path,
            dataset: dataset_id,
            width: width,
            height: height
        }, (err, user) => {
            // console.log("callback");
            if(err) {
                console.log("add dataset-iamge - error");
                callback(false);
            }
            else {
                console.log("Dodano dataset-iamge  - " + user.path);
                callback(true);
            }
        });
    }

    getDatasetsWithCounts2(callback) {
        let that = this;
        Dataset.find({}, (err, datasets) => {
            if(err)
                console.log("problem z getDatasets2");
            else {
                console.log(
                    "------ get datasets2 ---"
                );

                // let di = [];


                console.log("length " + datasets.length);
                let j = 0;

                datasets.forEach((dataset, i) => {
                   that.getOneDatasetsWithCounts(dataset._id, (dataset) => {
                       j++;
                       if(j == datasets.length - 1)
                            callback(datasets);
                   });
                });

            }
        });
    }

    getDatasetsWithCounts(callback) {
        let that = this;
        Dataset.find({}, (err, datasets) => {
            if(err)
                console.log("problem z getDatasets");
            else {
                console.log(
                    "------ get datasets ---"
                );

                let di = [];


                console.log("length " + datasets.length);

                if(datasets.length == 0) {
                    console.log("callback 1");
                    callback(datasets);
                    return;
                }

                let j = 0;
                datasets.forEach((dataset, i) => {
                    let all = 0, tagged = 0;

                    // console.log(dataset._id);
                    that.getAllCountsOfDataset(dataset._id, (count) => {
                        all = count;

                        that.getTaggedCountsOfDataset(dataset._id, (count) => {
                            tagged = count;

                            di.push({
                                countAll: all,
                                countTagged: tagged
                            })

                            dataset.countAll = all;
                            dataset.countTagged = tagged;

                            if(j++ == datasets.length-1) {
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

    addTag(datasetImage_id, user_id, tag, callback) {
        DatasetImage.update({
            _id: datasetImage_id
        }, {
            tag: tag,
            taggedBy: user_id
        }, (err, raw) => {
            if(err) {
                callback(false);
            }
            else callback(true);
        })
    }

    getOneDatasetsWithCounts(dataset_id, callback) {
        let that = this;
        Dataset.findOne({
            _id: dataset_id
        }, (err, dataset) => {
            if(err)
                console.log("problem z getDatasets");
            else {
                // console.log(datasets);

                // if(datasets.length == 0) {
                //     callback(datasets);
                //     return;
                // }
                // datasets.forEach((dataset, i) => {
                let all = 0, tagged = 0;

                // console.log(dataset._id);
                that.getAllCountsOfDataset(dataset._id, (count) => {
                    all = count;

                    that.getTaggedCountsOfDataset(dataset._id, (count) => {
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



    getNextDatasetImage(dataset_id, callback) {
        DatasetImage.findOne({
            dataset: dataset_id,
            tag: '',
            problem: ''
        }, (err, datasetImage) => {
            if(err) throw err;

            callback(datasetImage);
        });
    }

    getAllCountsOfDataset(dataset_id, callback) {
        DatasetImage.find({
            dataset: dataset_id
        }, (err, datasets) => {
            if(err) {
                console.log("agetAllCountsOfDataset - error");
                callback(-1);
            }
            else {
                callback(datasets.length);
            }
        });
    }

    getTaggedCountsOfDataset(dataset_id, callback) {
        DatasetImage.find({
            dataset: dataset_id,
            $or: [
                { tag: { $ne: "" } },
                { problem: { $ne: "" } }
            ]
        }, (err, datasets) => {
            if(err) {
                console.log("getTaggedCountsOfDataset - error");
                callback(-1);
            }
            else {
                callback(datasets.length);
            }
        });
    }

    checkIfUserExists(name, callback) {
        User.findOne({
            name: name
        }, (err, user) => {
            if(err || !user) {
                callback(false);
                return;
            }
            else callback(true);
        });
    }

    checkAuth(name, password, callback) {
        User.findOne({
            name: name
        }, (err, user) => {
            if(err || !user) {
                callback(false, user);
                return;
            }

            bcrypt.compare(password, user.password, (err, res) => {
                if(res) {
                    callback(true, user);
                } else {
                    callback(false, user);
                }
            });
        });
    }

    removeAll(callback) {
        console.log("remove all");
        User.remove({}, (err) => {
            if(err)
                console.log("problem z usuwaniem");
            else {
                console.log("usuwanie userów ok");
                callback();
            }

        });

        Dataset.remove({}, (err) => {
            if(err)
                console.log("problem z usuwaniem");
            else {
                console.log("usuwanie datasetów ok");
                callback();
            }

        });

        DatasetImage.remove({}, (err) => {
            if(err)
                console.log("problem z usuwaniem");
            else {
                console.log("usuwanie obrazów ok");
                callback();
            }

        });
    }
}