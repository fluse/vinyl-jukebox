var spotify = require('spotify-node-applescript');

module.exports = (app) => {

    return {

        _formatTime(timeInplayedTime) {
            // convert to minutes
            var minutes = Math.floor(timeInplayedTime / 60);
            // convert seconds
            var seconds = Math.floor(timeInplayedTime - minutes * 60);

            if (seconds < 10) {
                seconds = '0' + seconds;
            }

            if (seconds === 60) {
                seconds = '00';
                minutes++;
            }

            return minutes + ':' + seconds;
        },

        getPlayedTime(cb) {
            spotify.getState((err, state) => {
                if (err) {
                    return cb ({
                        formatted: 0,
                        seconds: 0
                    });
                }
                cb({
                    formatted: this._formatTime(state.position),
                    seconds: state.position
                });
            });
        },

        getTrackLength(cb) {
            spotify.getTrack((err, state) => {
                if (err) {
                    return cb ({
                        formatted: 0,
                        seconds: 0
                    });
                }
                cb({
                    formatted: this._formatTime(state.duration / 1000),
                    seconds: (state.duration / 1000)
                });
            });
        },

        play(cb) {
            spotify.play();
        },

        pause(cb) {
            spotify.pause();
        },

        next(cb) {
            spotify.next();
        },

        playTrack(trackId) {
            spotify.playTrack(trackId, function(){
                // Track is playing in context of an album
            });
        }
    };

};
