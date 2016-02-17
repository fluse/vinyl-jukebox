module.exports = function (app) {

    app.io.sockets.on('connection', function (socket) {
        console.log('connected');
        socket.on('play', app.api.service.spotifyRemote.play);
        socket.on('pause', app.api.service.spotifyRemote.pause);
        socket.on('next', app.api.service.spotifyRemote.next);
        socket.on('playTrack', app.api.service.spotifyRemote.playTrack);
        socket.on('addToQueue', (trackId) => {
            app.config.player.playlist.queue.push(trackId);
            app.io.sockets.emit('getQueue', app.config.player.playlist.queue);
        });
        socket.on('getQueue', () => {
            app.io.sockets.emit('getQueue', app.config.player.playlist.queue);
        });
        socket.on('getPlaylists', () => {
            app.config.player.playlists = [];
            app.api.service.spotify.getPlaylists(50, 0, (data) => {
                socket.emit('getPlaylists', data);
            });
        });
        socket.on('getPlaylist', (playlistId) => {
            app.api.service.spotify.getPlaylist(playlistId, (data) => {
                socket.emit('getPlaylist', data.body);
            });
        });
    });
};
