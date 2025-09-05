if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const expresslayouts = require('express-ejs-layouts');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');
const cors = require('cors');
   






const indexRouter = require('./routes/index');
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');
const limiter = ratelimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});



app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expresslayouts);
app.use(express.static('public'));
app.use(bodyparser.urlencoded({limit: '10mb', extended: false}));
app.use(helmet());
app.use(limiter);
app.use(cors({origin: 'https://ppedi.com'})); 

const mongoose = require('mongoose');
mongoose.connect((process.env.DATABASE_URL));

const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));



app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

app.listen(process.env.PORT || 3000, function(){
    console.log('Server started');
});

