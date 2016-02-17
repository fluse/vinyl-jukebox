module.exports = function (app) {

    const service = app.api.service;

    app.get('/', (req, res) => {
        console.log(req.get('host'))
        // render page
        res.renderPage({
            page: 'juke'
        }, {
            userIsLoggedIn: !!service.spotify.getAccessToken()
        });
    });

};
