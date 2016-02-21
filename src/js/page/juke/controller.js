
/* dependencies */
var Vue = require('vue');
var jQuery = require('jquery');

var Ps = require('perfect-scrollbar');

var Navigation = require('./../../mixin/navigation.js');
var Offline = require('./../../mixin/offline.js');
var Dialog = require('./../../mixin/dialog.js');

module.exports = function () {

    var data = require('./data.js');

    return new Vue({
        el: '#page',
        mixins: [Navigation, Offline, Dialog],
        data: data,
        ready () {
            // custom scrollbar
            Ps.initialize(jQuery('body')[0]);
            Ps.initialize(jQuery('#trackList')[0]);

            this.socket.on('getQueue', (queue) => {
                console.log(queue);
                this.socket.emit('getPlayedSong');
                this.playlist.queue = queue;
            });
            this.socket.on('getPlaylists', (playlistsArray) => {
                console.log(playlistsArray);
                this.playlist.list = playlistsArray;
                this.socket.emit('getPlayedSong');
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
            this.socket.on('getPlayedSong', (getPlayedSong) => {
                console.log(getPlayedSong);
                this.getPlayedSong = getPlayedSong;
            });
            this.socket.on('playState', (playState) => {
                console.log(playState);
                this.playState = playState;
            });
            if (this.userIsLoggedIn) {
                this.socket.emit('getPlaylists');
                this.socket.emit('getPlayedSong');
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
                console.log(track);
                this.socket.emit('addToQueue', track);
            },
            getTrackByPosition (pos) {
                return this.playlist.current.tracks.items[pos].track;
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
