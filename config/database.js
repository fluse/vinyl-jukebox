module.exports = {
    databaseType: 'mongo',
    url: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/vinylJukeBox'
};
