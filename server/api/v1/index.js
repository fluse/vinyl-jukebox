var glob = require('glob'),
    path = require('path');

// export complete api
module.exports = (app) => {

    app.api = {
        service: {}
    };

    glob.sync(__dirname + '/service/**/!(_global).js').forEach((file) => {
        var fileParty = file.split('/');
        var fileName = fileParty[fileParty.length - 1];
        var name = fileName.split('.')[0];

        app.api.service[name] = require(path.resolve(file))(app);
    });

    return app;
};
