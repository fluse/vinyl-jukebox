var mapping = require('./mapping.js');

var requestAnimFrame = (function(){
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

module.exports = function (eventList) {
    var lastStates = {
        axes: [],
        buttons: []
    };

    var defaultAxes = [];

    return {

        isRunning: false,

        isGamePadConnected () {
            return typeof navigator.getGamepads()[0] !== 'undefined';
        },

        start () {
            // isGamePad connected
            if (!this.isGamePadConnected()) {
                return 'no gamepad';
            }

            defaultAxes = navigator.getGamepads()[0] && navigator.getGamepads()[0].axes || [];

            lastStates = {
                axes: navigator.getGamepads()[0].axes,
                buttons: []
            };

            for (var i = 0; i < navigator.getGamepads()[0].buttons.length; i++) {
                lastStates.buttons.push(false);
            }

            this.isRunning = true;
            this.run();
        },

        stop () {
            this.isRunning = false;
        },

        run () {
            // abort if not running
            if (!this.isRunning) {
                return;
            }

            this.checkInteraction();

            requestAnimFrame(this.run.bind(this));

        },

        checkInteraction () {
            this.getPressedButtons();
            this.checkAxesIsInUse();
        },

        getPressedButtons () {
            var buttons = navigator.getGamepads()[0].buttons;

            for (var i = 0; i < buttons.length; i++) {

                if (buttons[i].pressed) {
                    if (lastStates.buttons[i] !== true) {
                        console.log(mapping.buttons[i]);
                        if (eventList.hasOwnProperty(mapping.buttons[i])) {
                            eventList[mapping.buttons[i]]();
                        }
                        lastStates.buttons[i] = true;
                    }
                } else {
                    lastStates.buttons[i] = false;
                }
            }
        },

        checkAxesIsInUse () {
            var axes = navigator.getGamepads()[0].axes;
            for (var i = 0; i < axes.length; i++) {
                if (defaultAxes[i] !== axes[i]) {
                    var action = axes[i] < 0 ? mapping.axes[i].negative : mapping.axes[i].positive;

                    if (lastStates.axes[i] !== axes[i] && eventList.hasOwnProperty(action)) {
                        console.log(action);
                        eventList[action]();
                        lastStates.axes[i] = axes[i];
                    }
                } else {
                    lastStates.axes[i] = axes[i];
                }
            }
        }
    };
};
