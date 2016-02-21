module.exports = {
    data: {
        dialog: {
            addToQueue: {
                show: false,
                callback: () => {}
            }
        }
    },
    ready () {
    },
    methods: {
        isDialogOpen() {
            for (var name in this.dialog) {
                if (this.dialog[name].show) {
                    return true;
                }
            }
        },

        dialogShow(name, cb) {
            this.dialog[name].show = true;
            this.navigation.dialogPos = 0;
            this.dialog[name].callback = cb;
        },

        dialogHide() {
            for (var name in this.dialog) {
                this.dialog[name].show = false;
            }
            this.navigation.dialogPos = -1;
        },

        dialogConfirm(name) {
            this.dialog[name].callback();
            this.dialogHide(name);
        },

        dialogCancle(name) {
            this.dialogHide(name);
        }
    }
};
