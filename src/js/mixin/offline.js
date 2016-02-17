module.exports = {
    data: {
        isOffline: false
    },
    ready () {

        setInterval(() => {
            this.isOffline = !navigator.onLine;
        }, 500);

    }
};
