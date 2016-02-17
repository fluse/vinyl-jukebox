
/* dependencies */
var Vue = require('vue');
var jQuery = require('jquery');

var Ps = require('perfect-scrollbar');

var Navigation = require('./../../mixin/navigation.js');
var Offline = require('./../../mixin/offline.js');

module.exports = function () {

    var data = require('./data.js');

    return new Vue({
        el: '#page',
        mixins: [Navigation, Offline],
        data: data,
        ready () {
            // custom scrollbar
            Ps.initialize(jQuery('body')[0]);
            Ps.initialize(jQuery('#trackList')[0]);

            this.socket.on('getQueue', (queue) => {
                this.queue = queue;
            });
            this.socket.on('getPlaylists', (playlistsArray) => {
                console.log(playlistsArray);
                this.playlist.list = playlistsArray;
                this.gamepad.start();
            });
            this.socket.on('getPlaylist', (currentPlaylist) => {
                console.log(currentPlaylist);
                this.playlist.current = currentPlaylist;
                Vue.nextTick(() => {
                    Ps.update(jQuery('#trackList')[0]);
                });
            });
            this.socket.on('userIsLoggedIn', (userIsLoggedIn) => {
                this.userIsLoggedIn = userIsLoggedIn;
            });
            if (this.userIsLoggedIn) {
                this.socket.emit('getPlaylists');
                this.socket.emit('getQueue');
            }
        },
        computed: {
        },
        methods: {
            play () {
                this.socket.emit('play');
            },
            pause () {
                this.socket.emit('pause');
            },
            next () {
                this.socket.emit('next');
            },
            addToQueue (track) {
                this.socket.emit('addToQueue', track);
            },
            playTrack (trackId) {
                this.socket.emit('playTrack', trackId);
            },
            getPlaylist (playlistId) {
                console.log(playlistId);
                this.socket.emit('getPlaylist', playlistId);
            }
        }

    });
};
