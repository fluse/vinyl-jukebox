var extend = require('extend');

module.exports = function (eventList) {

    var core = require('./core.js')(extend({}, eventList || {}));

    window.addEventListener('gamepadconnected', () => {
        core.start();
    });

    // set state to idle if gamepad disconnected
    window.addEventListener('gamepaddisconnected', () => {
        core.isRunning = false;
    });

    return core;
};
