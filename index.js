const startupDebugger = require('debug')('app:startup')
const dbDebugger = require('debug')('app:db')
const config = require('config');
const morgan = require('morgan');
const helmet = require('helmet');
const logger = require('./middleware/logger');
const authenticator = require('./middleware/authenticator');
const courses = require('./routes/courses');
const posts = require('./routes/posts');
const home = require('./routes/home');
const express = require('express');
const app = express();

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`app: ${app.get('env')}`);

app.set('view engine', 'pug'); //set the view engine of the application. No require is needed
app.set('views', './views');

//built-in middleware
app.use(express.json()); //enable parsing of json object in the body of the request.
app.use(express.urlencoded({extended: true})); //needed when request body is x-www-form-urlencoded
app.use(express.static('public'));
//3rd party middleware
app.use(helmet());
//custom middleware
app.use(logger);
app.use(authenticator);

console.log('Application Name:' + config.get('name'));
console.log('Mail Server:' + config.get('mail.host'));
console.log('Mail Password:' + config.get('mail.password'));

if(app.get('env') === 'development') {
    app.use(morgan('tiny'));
    startupDebugger('Morgan enabled...');
}

// DB work
dbDebugger('Connected to the database...');

//routes
app.use('/api/courses', courses);
app.use('/api/posts', posts);
app.use('/', home);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));