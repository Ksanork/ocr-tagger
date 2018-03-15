'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _index = require('./routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

app.set("view engine", "pug");

app.use(_express2.default.static('public'));
app.use("/", _index2.default);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, function () {
  return console.log('http://localhost:3000 is working');
});
//# sourceMappingURL=app.js.map