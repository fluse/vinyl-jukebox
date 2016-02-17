module.exports = function (app) {

    const service = app.api.service;

    app.get('/callback', (req, res) => {
        service.spotify.getToken(req.query.code, (err) => {
            if (!err) {
                console.log('is logged in');
                app.io.sockets.emit('userIsLoggedIn', true);
                app.io.sockets.emit('getQueue', app.config.player.playlist.queue);
                app.config.player.playlists = [];
                app.api.service.spotify.getPlaylists(50, 0, (data) => {
                    app.io.sockets.emit('getPlaylists', data);
                });
                return res.redirect('/manage');
            }

            res.json(err);
        });
    });

    app.get('/manage/activate', (req, res) => {
        console.log(service.spotify.getAccessToken());
        if (!service.spotify.getAccessToken()) {
            service.spotify.authUser(res);
        }
        res.json({});
    });

    app.get('/manage', (req, res) => {

        // render page
        res.renderPage({
            page: 'manage'
        }, {
            userIsLoggedIn: !!service.spotify.getAccessToken()
        });
    });

};
