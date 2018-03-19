import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser';
// import fileUpload from  'express-fileupload';

import router from './routes/index';

const app = express();

app.set("view engine", "pug");

// app.use(fileUpload());
app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json({
    extended: true
}));
app.use(session({
    secret: 'ks73jdns02js0',
    resave: true,
    saveUninitialized: false
}));
app.use(express.static('src/public'));
app.use("/dataset-images", express.static('dataset-images'));
app.use("/", router);

app.listen(3000, () => console.log('http://localhost:3000 is working'));
