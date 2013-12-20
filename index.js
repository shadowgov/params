/*!
 * Core dependencies.
 */

var util = require('util');

/**
 * Params constructor.
 *
 * @param {Object} hash
 * @constructor
 */

function Params(hash) {
  this.hash = hash;
  this.allowed = [];
};

/**
 * Parse arguments. If only one argument is supplied
 * and it is array, return it, instead of returning
 * the converted to array argument list.
 *
 * @param {Argumetns} args
 * @returns {Array}
 * @api private
 */

Params.prototype.parse = function(args) {
  args = slice(args);
  if (args.length === 1 && Array.isArray(args[0])) return args[0];
  return args
};

/**
 * Return a new hash, constructed from the
 * original hash, but containing only the
 * supplied keys.
 *
 * @param {Array|String} keys
 * @returns {Object} the new hash
 * @api public
 */

Params.prototype.only = function(args) {
  var allowed = this.parse(arguments)
    , obj = {};

  allowed.forEach(function(key) {
    obj[key] = this.hash[key];
  }, this);

  return obj;
};

/**
 * Filter given keys from a hash.
 *
 * @param {Array|String} filtered keys
 * @returns {Object} the new filtered hash
 * @api public
 */

Params.prototype.except = function(args) {
  var filtered = this.parse(arguments)
    , obj = {};

  Object.keys(this.hash).forEach(function(key) {
    if (~filtered.indexOf(key)) return;
    obj[key] = this.hash[key];
  }, this);

  return obj;
};

/**
 * Require given keys.
 *
 * @param {Array|String} required keys
 * @returns {Object} the original hash
 * @throws Error
 * @api public
 */

Params.prototype.require = function(args) {
  var required = this.parse(arguments)
    , obj = {};

  required.forEach(function(key) {
    if (key in this.hash) return;
    throw new Error('Missing key "' + key + '" for ' + util.inspect(this.hash));
  }, this);

  return this.hash;
};

/**
 * Permit given "key".
 *
 * @param {String} key
 * @returns {Params} `this`
 * @api public
 */

Params.prototype.permit = function(key) {
  this.allowed.push(key);
  return this;
};

/**
 * Mutate the supplied hash.
 *
 * @api public
 */

Params.prototype.slice = function() {
  Object.keys(this.hash).forEach(function(key) {
    if (!~this.allowed.indexOf(key)) {
      delete this.hash[key];
    }
  }, this);
};

/**
 * Slice.
 *
 * @param {Arguments} args
 * @returns {Array}
 */

function slice(args) {
  return Array.prototype.slice.call(args);
};

/*!
 * Create a new params object.
 *
 * @param {Object} object
 * @returns {Params} object
 */

module.exports = function(hash) {
  return new Params(hash);
};

/*!
 * Expose `Params`.
 */

module.exports.Params = Params;
