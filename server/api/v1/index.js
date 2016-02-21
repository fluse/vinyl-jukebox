var mongoose = require('mongoose'),
    glob = require('glob'),
    path = require('path'),
    requireAll = require('require-all');

// export complete api
module.exports = (app) => {

    // connect to db
    mongoose.connect(app.config.database.url, (err) => {
        if (err) {
            console.log('ERROR connecting to: %s. %s', app.config.database.url, err);
        } else {
            console.log('Succeeded connected to: %s \n\n', app.config.database.url);
        }
    });

    app.api = {
        model: requireAll(__dirname + '/model'),
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
