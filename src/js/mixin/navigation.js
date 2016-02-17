var Vue = require('vue');
var jQuery = require('jquery');

var Gamepad = require('./../components/gamepad/');

module.exports = {
    ready () {
        this.gamepad = new Gamepad({
            right: this.selectSpecificCover.bind(this, 1),
            left: this.selectSpecificCover.bind(this, -1),
            up: this.selectSpecificCover.bind(this, -this.settings.coversInARow),
            down: this.selectSpecificCover.bind(this, this.settings.coversInARow),
            select: this.selectElement.bind(this),
            back: this.deselectElement.bind(this),
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
                var topPos = (el.offset().top - (jQuery('#trackList').height / 2)) + (el.outerHeight(true));
                jQuery('#trackList').stop().animate({
                    scrollTop: topPos
                }, 300);
            });
        },
        selectList (index) {
            this.coverList.activeCover = index;
        },
        selectSpecificCover (count) {

            if (this.coverList.activeCover !== null) {
                count > 0 ? this.trackList.selectedTrack++ : this.trackList.selectedTrack--;
                console.log(this.trackList.selectedTrack);
                this._scrollToSelectedTrack();
                return;
            }

            var nextPos = this.coverList.selectedCover + count;
            if (nextPos > -1 && nextPos < this.playlist.list.length) {
                this.coverList.selectedCover = nextPos;
            }
            this._scrollToSelectedCover();
        },
        selectElement() {
            if (this.coverList.activeCover === null) {
                this.coverList.selectedCover = jQuery('.cover-list .selected').index();
                this.getPlaylist(this.playlist.list[this.coverList.selectedCover].id);
                this.selectList(this.coverList.selectedCover);
            }
        },
        selectNext() {
            if (this.coverList.activeCover !== null) {
                this.coverList.selectedCover++;
                this.getPlaylist(this.playlist.list[this.coverList.selectedCover].id);
                this.selectList(this.coverList.selectedCover);
                this._scrollToSelectedCover();
            }
        },
        selectPrev() {
            if (this.coverList.activeCover !== null) {
                this.coverList.selectedCover--;
                this.getPlaylist(this.playlist.list[this.coverList.selectedCover].id);
                this.selectList(this.coverList.selectedCover);
                this._scrollToSelectedCover();
            }
        },
        deselectElement() {
            this.coverList.activeCover = null;
        }
    }
};
