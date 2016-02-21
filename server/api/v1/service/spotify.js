var SpotifyWebApi = require('spotify-web-api-node');
var _ = require('lodash');

module.exports = (app) => {

    // credentials are optional
    var spotify = new SpotifyWebApi({
      clientId : app.config.service.spotify.clientId,
      clientSecret : app.config.service.spotify.clientSecret,
      redirectUri : app.config.service.spotify.redirect
    });

    return {

        authUser(res) {
            console.log('auth user');
            var scopes = [
                'user-read-private',
                'playlist-read-private',
                'playlist-modify-public',
                'playlist-modify-private',
                'playlist-read-collaborative',
                'user-read-private',
                'streaming',
                'user-follow-read',
                'user-read-email'
            ],
            state = 'vinylJukeBoxCode';
            var url = spotify.createAuthorizeURL(scopes, state);
            res.redirect(url);
        },

        getToken(code, cb) {
            console.log('code %s', code);
            spotify.authorizationCodeGrant(code).then((data) => {
                console.log('The token expires in ' + data.body.expires_in);

                // Set the access token on the API object to use it in later calls
                spotify.setAccessToken(data.body.access_token);
                spotify.setRefreshToken(data.body.refresh_token);

                this.getMe(cb);
                //spotify.refreshToken();

            }, function(err) {
                cb(err);
            });
        },

        refreshToken(cb) {
            spotify.refreshAccessToken().then(function(data) {
                console.log('The access token has been refreshed!');
                cb();
            }, function(err) {
                console.log('Could not refresh access token', err);
                cb();
            });
        },

        getAccessToken() {
            return spotify.getAccessToken();
        },

        getMe(cb) {
            spotify.getMe().then(function(data) {
                app.config.service.spotify.user = data.body;
                cb(null);
            }, function(err) {
                console.log('Something went wrong!', err);
            });
        },

        getPlaylist(playlistId, cb) {
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

        getPlaylists(limit, offset, cb) {
            console.log('get playlist from limit%s to offset%s', limit, offset);
            this.grepPlaylists(limit, offset, (data) => {

                // remove playlists that the user not own
                data.body.items = _.remove(data.body.items, (list) => {
                    return list.owner.id === app.config.service.spotify.user.id;
                });

                app.config.player.playlists = app.config.player.playlists.concat(data.body.items);
                if (data.body.next) {
                    this.getPlaylists(50, offset + limit, cb);
                    cb(app.config.player.playlists);
                } else {
                    console.log('%s items', app.config.player.playlists.length);
                    cb(app.config.player.playlists);
                }
            });
        },

        grepPlaylists(limit, offset, cb) {
            //console.log(app.config.service.spotify.user);
            spotify.getUserPlaylists(app.config.service.spotify.user.id, {
                limit: limit,
                offset: offset
            }).then(function(data) {
                cb(data);
            }, function(err) {

                cb([]);
                console.log('Something went wrong!', err);
            });
        },

        getTracks(trackId, cb) {
            spotify.getTracks([trackId]).then(function(data) {
                cb(data.body.tracks[0]);
            }, function(err) {
                cb([]);
                console.log('Something went wrong!', err);
            });
        }
    };

};
