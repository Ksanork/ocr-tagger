import express from 'express';
import multer from 'multer';
import fs from 'fs';
import sizeOf from 'image-size';

import DBO from '../models/DBO'
import config from '../config'

let router = express.Router();
let dbo = new DBO(config.mongo_url);


let Storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, "dataset-images");
    },

    filename: function(req, file, callback) {
        const filename = file.fieldname + "_" + Date.now() + "_" + file.originalname;
        callback(null, filename);
    }
});

let upload = multer({
    storage: Storage
}).single('file');



let authorise = function(req, res, next) {
    if(req.session.auth && req.session.authUser) {


        // let datasets =  dbo.getDatasetsWithCounts2();

        dbo.getDatasetsWithCounts((datasets) => {
            datasets.forEach((elem) => {
                console.log("get " + elem.countTagged + " / " + elem.countAll);
            });

            res.render('panel', { username: req.session.authUser, isAdmin: req.session.isAdmin, datasets: datasets});
        });


        // next();
        // res.render("panel", { username: req.session.authUser, isAdmin: req.session.isAdmin });
    }
    else {
        next();
    }
}

router.get('/', authorise, (req, res) => {
    res.render("login");
});

router.get('/register', authorise, (req, res) => {
    res.render("register");
});

router.post("/login", authorise, (req, res, next) => {
    if(dbo.checkAuth(req.body.name, req.body.password, (status, user) => {
            if(status) {
                req.session.auth = true;
                req.session.authUser = user.name;
                req.session.isAdmin = user.isAdmin;
                req.session.userId = user._id;

                console.log("auth ok - " + req.session.authUser);

                dbo.getDatasetsWithCounts((datasets) => {
                    datasets.forEach((elem) => {
                        console.log("get " + elem.countTagged + " / " + elem.countAll);
                    });

                    res.render('panel-partial', { username: user.name, isAdmin: user.isAdmin, datasets: datasets},
                        function (err, output) {
                            console.log("res");
                            res.json(JSON.stringify({ status: "true", html: output }));
                        });
                });
            }
            else {
                res.json(JSON.stringify({status: "false"}));
            }
        }));
});

router.post("/new-register", authorise, (req, res, next) => {
    dbo.checkIfUserExists(req.body.name, (result) => {
        if(!result) {
            dbo.addUser(req.body.name, req.body.password, false, (status) => {
                res.render('register-confirm', { status: status }, (err, output) => {
                    res.json(JSON.stringify({ html: output }));
                });
            });
        }
        else {
            res.json(JSON.stringify({ status: "user-exists", html: null }));
        }
    });
});


/*

    Panel

 */

router.post('/open-add-dataset', (req, res) => {
    res.render('add-dataset', (err, output) => {
        res.json(JSON.stringify({ html: output }));
    });
});

router.post('/add-dataset', (req, res) => {
    dbo.addDataset(req.body.name, req.body.desc, (status, dataset) => {
        if(status) {
            res.json(JSON.stringify({ status: "true", dataset_id: dataset._id}));
        }
    });
});

router.post("/add-dataset-image", (req, res) =>  {
    upload(req, res, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            const path = "dataset-images/" + req.body.dataset_id;
            if (!fs.existsSync(path)){
                fs.mkdirSync(path);
            }

            sizeOf(req.file.path, (err, size) => {
                if (!err) {
                    console.log('width = ' + size.width);
                    console.log('height = ' + size.height);

                    console.log(req.file.path + " => " + path + " - " + req.file.filename);

                    fs.rename(req.file.path, path + "/" + req.file.filename, (err) => {
                        if(err) throw err;
                        else console.log('Successfully moved');
                    });

                    dbo.addDatasetImage(path + "/" + req.file.filename, req.body.dataset_id,
                        size.width, size.height, (status) => {});


                    res.sendStatus(200);

                } else {
                    console.log("Problem z określaniem rozmiaru - " + err);
                }
            });


        }
    });
});

router.post("/get-datasets", (req, res) => {
    dbo.getDatasetsWithCounts((datasets) => {
        datasets.forEach((elem) => {
            console.log("get " + elem.countTagged + " / " + elem.countAll);
        });

        res.render('datasets-partial', { datasets: datasets }, (err, output) => {
            // console.log("get " + da)

            res.json(JSON.stringify({ html: output }));
        });
    });
});

router.post("/get-dataset-image", (req, res) => {
    dbo.getNextDatasetImage(req.body.dataset_id, (datasetImage) => {
        if(datasetImage == null) {
            console.log("koniec datasetu");
            res.sendStatus(404);
        }
        else {
            dbo.getOneDatasetsWithCounts(req.body.dataset_id, (dataset) => {
                res.render('tagging', {
                    dataset: dataset.name,
                    datasetImage_id: datasetImage._id,
                    path: datasetImage.path,
                    countTagged: dataset.countTagged,
                    countAll: dataset.countAll
                }, (err, output) => {
                    res.json(JSON.stringify({ src: datasetImage.path, width: datasetImage.width,
                        height: datasetImage.height, html: output }));
                });
            });
        }

    });
});

// sprawdzać czy jest już otagowany
router.post("/add-tag", (req, res) => {
    dbo.addTag(req.body.datasetImage_id, req.session.userId, req.body.tag, (status) => {
        if(status)
            res.send("true");
    });
});

router.post("/logout", (req, res) => {
    console.log("logout");

    req.session.destroy();
    res.render('login-partial', (err, output) => {
        res.json(JSON.stringify({ status: "true", html: output }));
    });
});


export default router;