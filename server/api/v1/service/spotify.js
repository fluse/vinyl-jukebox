var SpotifyWebApi = require('spotify-web-api-node');
var request = require('request');

module.exports = (app) => {

    // credentials are optional
    var spotify = new SpotifyWebApi({
      clientId : app.config.service.spotify.cliendId,
      clientSecret : app.config.service.spotify.cliendSecret,
      redirectUri : app.config.service.spotify.redirect
    });

    return {

        authUser(res) {
            res.redirect('https://accounts.spotify.com/authorize/?client_id=' + app.config.service.spotify.clientId +'&response_type=code&redirect_uri=' + app.config.service.spotify.redirect + '&scope=user-read-private playlist-read-private playlist-modify-public playlist-modify-private playlist-read-collaborative user-read-private streaming user-follow-read user-read-email&state=34fFs29kd09')
        },

        getToken(query, cb) {

            var encryptedKey = new Buffer(app.config.service.spotify.clientId + ':' + app.config.service.spotify.clientSecret).toString('base64');

            request.post('https://accounts.spotify.com/api/token', {
                headers: {
                    'Authorization': 'Basic ' + encryptedKey
                },
                json: true,
                form: {
                    code: query.code,
                    grant_type: 'authorization_code',
                    redirect_uri: app.config.service.spotify.redirect
                }
            }, (err, response, body) => {
                // check for token
                if (body.access_token) {
                    // cache token
                    app.config.service.spotify.token = body.access_token;
                    spotify.setAccessToken(app.config.service.spotify.token);
                    this.getMe();
                    cb(null);
                } else {
                    cb('someting went wrong');
                }
            });
        },

        getMe() {
            spotify.getMe().then(function(data) {
                app.config.service.spotify.user = data.body;
            }, function(err) {
                console.log('Something went wrong!', err);
            });
        },

        getPlaylist(playlistId, cb) {

            console.log(playlistId);
            spotify.getPlaylist(app.config.service.spotify.user.id, playlistId, {
                limit: 50
            }).then(function(data) {
                cb(data);
                console.log(data);
            }, function(err) {
                cb();
                console.log('Something went wrong!', err);
            });
        },

        getPlaylists(cb) {
            //console.log(app.config.service.spotify.user);
            spotify.getUserPlaylists(app.config.service.spotify.user.id, {
                limit: 50
            }).then(function(data) {
                cb(data);
            }, function(err) {
                cb();
                console.log('Something went wrong!', err);
            });
        }
    };

};
