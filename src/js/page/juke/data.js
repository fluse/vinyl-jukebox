/* globals response */

var extend = require('extend');
var socket = require('socket.io-client')('http://' + window.location.hostname + ':4711');

module.exports = function () {

    return extend({
        socket: socket,
        gamepad: null,
        userIsLoggedIn: false,
        getPlayedSong: {},
        playState: {},
        playlist: {
            list: [],
            current: [],
            queue: []
        },
        coverList: {
            selectedCover: 0,
            activeCover: null
        },
        trackList: {
            selectedTrack: 0,
            activeTrack: null,
        },
        settings: {
            coversInARow: 6,
        }
    }, response);

};
