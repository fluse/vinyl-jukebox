
module.exports = (app) => {
    return {

        start() {
            this.getPlayedSong();
            // playlist controller
            setInterval(() => {
                this.getPlayState((playerState) => {

                    console.log('played %s/%s %s%',
                        playerState.playedTime.formatted,
                        playerState.duration.formatted,
                        playerState.percentage
                    );

                    if (parseFloat(playerState.percentage) > parseFloat(99)) {
                        return this.playNextFromQueue();
                    }
                });
            }, 500);
        },

        getPlayState(cb) {
            app.api.service.spotifyRemote.getTrackLength((duration) => {
                app.api.service.spotifyRemote.getPlayedTime((playedTime) => {

                    var percentage = (playedTime.seconds * 100) / duration.seconds;

                    var playerState = {
                        duration: duration,
                        playedTime: playedTime,
                        percentage: percentage
                    };

                    cb(playerState);

                    app.io.sockets.emit('playState', playerState);

                    return playerState;
                });
            });

        },

        playNextFromQueue() {
            if (app.config.player.playlist.queue.length > 0) {
                app.api.service.spotifyRemote.playTrack(app.config.player.playlist.queue[0].uri);
                app.config.player.playlist.queue = app.config.player.playlist.queue.splice(1);

                this.getPlayedSong();
            } else {
                //play defined fallback playlist
            }
        },

        getPlayedSong() {
            app.api.service.spotifyRemote.getState((state) => {
                if (state === undefined) {
                    return app.io.sockets.emit('getPlayedSong', state);
                }
                var uriArray = state.track_id.split(':');
                var trackId = uriArray[uriArray.length - 1];

                app.io.sockets.emit('getQueue', app.config.player.playlist.queue);

                app.api.service.spotify.getTracks(trackId, (track) => {
                    state.track = track;
                    app.io.sockets.emit('getPlayedSong', state);
                });
            });
        }
    };
};
