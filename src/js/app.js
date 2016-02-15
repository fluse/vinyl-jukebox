/* globals response, tinymce, confirm */
var socket = require('socket.io-client')('http://localhost:4711');
/* dependencies */
var Vue = require('vue');

var vueInstance = new Vue({
    el: '#page',
    mixins: [],
    data: {
        socket: socket,
        playlists: [],
        currentPlaylist: []
    },
    ready () {
        this.socket.on('connect', function(e){
            console.log(e);
        });

        this.socket.on('addToPlayList', (socket) => {
            console.log(socket);
            //this.playlist = socket.playlist;
        });
        this.socket.on('getPlaylists', (socket) => {
            console.log(socket.body.items);
            this.playlists = socket.body.items;
        });
        this.socket.on('getPlaylist', (socket) => {
            console.log(socket.body.tracks);
            this.currentPlaylist = socket.body.tracks.items;
        });
        this.socket.emit('getPlaylists');
    },
    computed: {
    },
    methods: {
        play () {
            console.log('play');
            this.socket.emit('play');
        },
        pause () {
            console.log('pause');
            this.socket.emit('pause');
        },
        next () {
            console.log('next');
            this.socket.emit('next');
        },
        addToPlayList (track) {
            this.socket.emit('addToPlayList', track);
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
