import express from 'express';
import router from './routes/index';

const app = express();

app.set("view engine", "pug");

app.use(express.static('public'));
app.use("/", router);
// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000, () => console.log('http://localhost:3000 is working'));
