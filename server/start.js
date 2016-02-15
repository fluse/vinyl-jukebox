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

io.sockets.on('connection', function (socket) {
    socket.on('play', app.api.service.spotifyRemote.play);
    socket.on('pause', app.api.service.spotifyRemote.pause);
    socket.on('next', app.api.service.spotifyRemote.next);
    socket.on('playTrack', app.api.service.spotifyRemote.playTrack);
    socket.on('getPlaylists', () => {
        app.api.service.spotify.getPlaylists((data) => {
            socket.emit('getPlaylists', data);
        });
    });
    socket.on('getPlaylist', (playlistId) => {
        app.api.service.spotify.getPlaylist(playlistId, (data) => {
            socket.emit('getPlaylist', data);
        });
    });
});

console.log('server listen on port %s', app.config.request.environment.port);
