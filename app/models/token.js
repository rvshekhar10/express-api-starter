'use strict';

const EXPIRATION = 30; // in days
const LEN = 32;

const mongoose = require('mongoose');
const tokenHelper = require('../helpers/token');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

var TokenSchema = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  hash: {
    type: String,
  },
  expiresAt: {
    type: Date,
    default: function() {
      var now = new Date();
      now.setDate(now.getDate() + EXPIRATION);

      return now;
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Generate a random token for a user, length is defined by the LEN constant.
 *
 * @param {Function} callback
 */
TokenSchema.statics.generate = function(opts, callback) {
  var self = this;

  tokenHelper.generate(opts.tokenLength || LEN, function(err, tokenString) {
    if (err) {
      return callback(err);
    }

    opts.hash = tokenString;

    self.model('Token').create(opts, callback);
  });
};

// compile Token model
module.exports = mongoose.model('Token', TokenSchema);
