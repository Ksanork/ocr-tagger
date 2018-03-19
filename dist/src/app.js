'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();
// import fileUpload from  'express-fileupload';

app.set("view engine", "pug");

// app.use(fileUpload());
app.use((0, _cookieParser2.default)());
app.use(_bodyParser2.default.urlencoded({
    extended: true
}));
app.use(_bodyParser2.default.json({
    extended: true
}));
app.use((0, _expressSession2.default)({
    secret: 'ks73jdns02js0',
    resave: true,
    saveUninitialized: false
}));
app.use(_express2.default.static('src/public'));
app.use("/dataset-images", _express2.default.static('dataset-images'));
app.use("/", _index2.default);

app.listen(3000, function () {
    return console.log('http://localhost:3000 is working');
});
//# sourceMappingURL=app.js.map