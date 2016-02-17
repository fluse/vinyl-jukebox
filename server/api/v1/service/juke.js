
module.exports = (app) => {
    return {
        start() {
            // playlist controller
            setInterval(() => {
                app.api.service.spotifyRemote.getTrackLength((duration) => {
                    app.api.service.spotifyRemote.getPlayedTime((playedTime) => {
                        var percentage = (playedTime.seconds * 100) / duration.seconds;
                        if (parseFloat(percentage) > parseFloat(99)) {
                            if (app.config.player.playlist.queue.length > 0) {
                                app.api.service.spotifyRemote.playTrack(app.config.player.playlist.queue[0].uri);
                                app.config.player.playlist.queue = app.config.player.playlist.queue.splice(1);
                                io.sockets.emit('getQueue', app.config.player.playlist.queue);
                            }
                        } else {
                            //console.log('played %s/%s %s%', playedTime.formatted, duration.formatted, percentage);
                        }
                    });
                });
            }, 400);
        }
    }
};
