'use strict';

var mongoose = require('mongoose');
var deepExtend = require('deep-extend');
var deepPopulate = require('mongoose-deep-populate')(mongoose);

/*
 * Schema
 */
var schema = new mongoose.Schema({
    name: {
        type: String,
        default: ''
    },
    list: [{
        keyword: {
            type: String,
            default: ''
        },
        landingPageId: {
            type: String,
            default: ''
        },
        landingPage: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LandingPage'
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    helper: {
        isCurrent: {
            type: String,
            default: ''
        }
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'list.landingPage': {
            select: 'meta'
        }
    },
    rewrite: {
        'landings': 'list.landingPage'
    }
});

schema.pre('save', function (next) {
    this.updatedAt = new Date();
    this.helper.isCurrent = '';
    next();
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
    }).deepPopulate('landings').exec(cb);
};

schema.statics.all = function (cb) {
    this.find({}).deepPopulate('landings').exec(cb);
};

module.exports = mongoose.model('LandingGroup', schema);
