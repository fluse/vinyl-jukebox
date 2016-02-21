var Vue = require('vue');
var jQuery = require('jquery');

var Gamepad = require('./../components/gamepad/');

module.exports = {
    data: {
        navigation: {
            coverPos: 0,
            trackPos: -1,
            dialogPos: -1,
            isDashboardVisible: 0
        },
    },
    ready () {
        this.gamepad = new Gamepad({
            right: this.navigateTo.bind(this, 1),
            left: this.navigateTo.bind(this, -1),
            up: this.navigateTo.bind(this, -this.settings.coversInARow),
            down: this.navigateTo.bind(this, this.settings.coversInARow),
            select: this.selectElement.bind(this),
            back: this.deselectElement.bind(this),
            option: this.toggleDashboard.bind(this),
            shoulderRightOne: this.selectNext.bind(this),
            shoulderLeftOne: this.selectPrev.bind(this)
        });

    },
    methods: {
        _scrollToSelectedCover () {
            Vue.nextTick(() => {
                var el = jQuery('.cover-list .selected');
                var topPos = (el.offset().top - (screen.height / 2)) + (el.outerHeight(true));
                jQuery('html, body').stop().animate({
                    scrollTop: topPos
                }, 300);
            });
        },
        _scrollToSelectedTrack () {
            Vue.nextTick(() => {
                var el = jQuery('#trackList .selected');
                if (el.length === 0) {
                    return false;
                }
                var topPos = (el.position().top - (jQuery('#trackList').outerHeight() / 2)) + (el.outerHeight(true));
                console.log(topPos);
                jQuery('#trackList').stop().animate({
                    scrollTop: topPos
                }, 300);
            });
        },
        toggleDashboard () {
            this.navigation.isDashboardVisible = !this.navigation.isDashboardVisible;
        },
        selectList (index) {
            this.coverList.activeCover = index;
        },
        navigateTo (pos) {
            if (this.navigation.dialogPos >= 0) {
                return this.navigateToDialogButton(pos);
            }

            this.navigation.isDashboardVisible = false;

            // if a cover is selected navigate tracks
            if (this.coverList.activeCover !== null) {
                return this.navigateToTrack(pos);
            }


            return this.navigateToCover(pos);
        },
        navigateToTrack (pos) {

            // only if list is loaded
            if (this.playlist.current === null) {
                return false;
            }

            // normalize to only one step
            pos = pos > 0 ? 1 : -1;
            // calculate
            var nextPos = this.navigation.trackPos + pos;
            // check bounds
            if (nextPos > -1 && nextPos < this.playlist.current.tracks.items.length) {
                this.navigation.trackPos = nextPos;
            }
            // do scrolling
            this._scrollToSelectedTrack();
        },
        navigateToCover (pos) {
            var nextPos = this.navigation.coverPos + pos;
            if (nextPos > -1 && nextPos < this.playlist.list.length) {
                this.navigation.coverPos = nextPos;
            }
            this._scrollToSelectedCover();
        },
        navigateToDialogButton(pos) {
            // normalize to only one step
            pos = pos > 0 ? 1 : -1;

            var nextPos = this.navigation.dialogPos + pos;
            // check bounds
            console.log(nextPos);
            if (nextPos > -1 && nextPos < 2) {
                this.navigation.dialogPos = nextPos;
            }
        },
        selectElement() {
            if (this.navigation.dialogPos >= 0) {
                return this.dialogConfirm('addToQueue');
            }

            if (this.coverList.activeCover !== null) {
                var track = this.getTrackByPosition(this.navigation.trackPos);
                this.dialogShow(
                    'addToQueue',
                    this.addToQueue.bind(this, track)
                );
                return;
            }
            this.navigation.trackPos = 0;
            this._scrollToSelectedTrack();
            this.navigation.coverPos = jQuery('.cover-list .selected').index();

            this.getPlaylist(
                this.playlist.list[this.navigation.coverPos].id
            );

            this.selectList(this.navigation.coverPos);
        },
        selectNext() {

            if (this.coverList.activeCover !== null) {
                this.navigation.trackPos = 0;
                this._scrollToSelectedTrack();
                this.navigation.coverPos++;

                this.getPlaylist(
                    this.playlist.list[this.navigation.coverPos].id
                );

                this.selectList(this.navigation.coverPos);
                this._scrollToSelectedCover();
            }
        },
        selectPrev() {
            if (this.coverList.activeCover !== null) {
                this.navigation.trackPos = 0;
                this._scrollToSelectedTrack();
                this.navigation.coverPos--;

                this.getPlaylist(
                    this.playlist.list[this.navigation.coverPos].id
                );

                this.selectList(this.navigation.coverPos);
                this._scrollToSelectedCover();
            }
        },
        deselectElement() {

            if (this.isDialogOpen()) {
                return this.dialogHide();
            }

            this.coverList.activeCover = null;
            this.trackList.selectedTrack = 0;
            this.navigation.trackPos = -1;
            this.playlist.current = null;
        }
    }
};
