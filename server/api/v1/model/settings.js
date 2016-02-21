'use strict';

var mongoose = require('mongoose');
var deepExtend = require('deep-extend');

/*
 * Schema
 */
var schema = new mongoose.Schema({
    accessTokenCode: {
        type: String,
        default: ''
    }
});

schema.statics.update = function (pageId, data, cb) {
    this.findOne({
        _id: pageId,
    }).exec((err, page) => {
        // error or empty
        if (err || page === null) {
            cb('page not found', pageId);
        } else {
            page = deepExtend(page, data);
            page.save(cb);
        }
    });
};

schema.statics.single = function (pageId, cb) {
    this.findOne({
        _id: pageId
    }).exec(cb);
};

schema.statics.all = function (cb) {
    this.find({}).exec(cb);
};

module.exports = mongoose.model('Settings', schema);
