module.exports = function (app) {

    app.io.sockets.on('connection', function (socket) {
        socket.on('play', app.api.service.spotifyRemote.play);
        socket.on('pause', app.api.service.spotifyRemote.pause);
        socket.on('next', app.api.service.spotifyRemote.next);
        socket.on('playTrack', app.api.service.spotifyRemote.playTrack);
        socket.on('addToQueue', (track) => {
            app.config.player.playlist.queue.push(track);
            app.io.sockets.emit('getQueue', app.config.player.playlist.queue);
        });
        socket.on('getQueue', () => {
            app.io.sockets.emit('getQueue', app.config.player.playlist.queue);
        });
        socket.on('getPlaylists', () => {
            console.log("get playlists");
            app.config.player.playlists = [];
            app.api.service.spotify.refreshToken(() => {
                console.log("get playlists inner");
                app.api.service.spotify.getPlaylists(50, 0, (data) => {
                    app.io.sockets.emit('getPlaylists', data);
                });
            });
        });
        socket.on('getPlaylist', (playlistId) => {
            app.api.service.spotify.refreshToken(() => {
                app.api.service.spotify.getPlaylist(playlistId, (data) => {
                    app.io.sockets.emit('getPlaylist', data.body);
                });
            });
        });
        socket.on('getPlayedSong', () => {
            app.api.service.spotifyRemote.getState((state) => {
                if (state === undefined) {
                    return app.io.sockets.emit('getPlayedSong', state);
                }
                var uriArray = state.track_id.split(':');
                var trackId = uriArray[uriArray.length - 1];

                app.api.service.spotify.getTracks(trackId, (track) => {
                    state.track = track;
                    app.io.sockets.emit('getPlayedSong', state);
                });
            });
        });
    });
};
