var request = require('request');
var spotify = require('spotify-node-applescript');

module.exports = (app) => {

    return {

        play(cb) {
            console.log('play');
            spotify.play();
        },

        pause(cb) {
            console.log('pause');
            spotify.pause();
        },

        next(cb) {
            console.log('pause');
            spotify.next();
        },

        playTrack(trackId) {
            spotify.playTrack(trackId, function(){
                // Track is playing in context of an album
            });
        }
    };

};
