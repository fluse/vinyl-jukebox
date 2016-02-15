var request = require('request');

module.exports = function (app) {

    const service = app.api.service;

    app.get('/callback', (req, res) => {
        service.spotify.getToken(req.query, (err) => {
            if (!err) {
                return res.redirect('/');
            }
            console.log(err);
            res.renderPage({
                page: 'home'
            }, {});
        });
    });

    app.get('/', (req, res) => {
        if (!app.config.service.spotify.token) {
            service.spotify.authUser(res);
        }
        // render page
        res.renderPage({
            page: 'home'
        }, {});
    });

};
