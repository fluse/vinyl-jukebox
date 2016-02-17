process.env.TZ = 'Europe/Amsterdam';

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    exphbs = require('express-handlebars'),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    compression = require('compression'),
    // get application config
    app = require('./../config/')(app),
    // get application api
    app = require('./api/v1/')(app);

app.io = io;
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: false
}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(compression());

// Create `ExpressHandlebars` instance with a default layout.
var hbs = exphbs.create({
    defaultLayout: app.config.layout.defaultTemplate,
    layoutsDir: 'templates/layouts/',
    extname: '.hbs',
    partialsDir: [
        'templates/components/'
    ],
    helpers: require('./../templates/helper')
});

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'templates/');

// Static Routes
app.use('/public', express.static('public'));

// get routes
require('./routes/')(app);

server.listen(app.config.request.environment.port);

// start juke box listener
app.api.service.juke.start();

console.log('jukebox listen on port %s', app.config.request.environment.port);
