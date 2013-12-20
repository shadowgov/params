var typeOf = require('type-detect');

module.exports = Params;

/**
 * Params constructor.
 *
 * @param {Object} hash
 * @constructor
 */

function Params(hash) {
  if (!(this instanceof Params)) return new Params(hash);
  this.hash = hash;
  this.allowed = [];
};

/**
 * #### Params.extend(dest, source, ...)
 *
 * For each source, shallow merge its key/values to the
 * destinatino. Sources are read in order, meaning the same
 * key in a later source will overwrite the key's value earlier
 * set.
 *
 * ```js
 * var extend = require('params').extend;
 *
 * // sample objects
 * var a = { hello: 'universe' };
 * var b = { speak: 'loudly' };
 *
 * // change a
 * extend(a, b);
 * a.should.deep.equal({ hello: 'universe', speak: 'loudly' });
 *
 * // shallow clone to c
 * var c = extend({}, a);
 * a.language = 'en';
 *
 * a.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
 * c.should.deep.equal({ hello: 'universe', speak: 'loudly' });
 * ```
 *
 * @param {Object} destination
 * @param {Object} sources ...
 * @return {Object} destination extended
 * @api public
 */

Params.extend = function() {
  var args = [].slice.call(arguments);
  var res = args.shift();

  for (var i = 0; i < args.length; i++) {
    extend(res, args[i]);
  }

  return res;
};

/*!
 * Actually extend
 */

function extend(a, b) {
  if (a && b) {
    for (var key in b) {
      a[key] = b[key];
    }
  }

  return a;
};

/**
 * ### Params.include(props, ...)
 *
 * Create a new object that only includes the properties
 * specified. Unlike `Params.extend()`, the original objects
 * will not be modified.
 *
 * This method will return a function that can be
 * reused for the specified properties. Like `Params.extend()`,
 * this function accepts an unlimited number of objects
 * as parameters to draw from. Also, the same key in later
 * specified objects will overwrite earlier specified values.
 *
 * ```js
 * var params = require('params');
 * var include = params.include('one', 'two');
 *
 * var a = { one: 1, three: 3 };
 * var b = { zero: 0, two: 2 };
 *
 * var c = include(a, b);
 *
 * c.should.deep.equal({ one: 1, two: 2 });
 * ```
 *
 * @param {String} each property to include as an argument
 * @return {Function} reusable include function
 * @api public
 */

Params.include = function() {
  var includes = [].slice.call(arguments);

  function include(res, obj) {
    Object.keys(obj).forEach(function(key) {
      if (~includes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendInclude() {
    var args = [].slice.call(arguments);
    var res = {};

    for (var i = 0; i < args.length; i++) {
      include(res, args[i]);
    }

    return res;
  };
};

/**
 * ### extend.exclude (props, ...)
 *
 * Create a new object that include all but the properties
 * specified. Unlike `extend()`, the original objects
 * will not be modified.
 *
 * This method will return a function that can be
 * reused for the specified properties. Like `extend()`,
 * this function accepts an unlimited number of objects
 * as parameters to draw from. Also, the same key in later
 * specified objects will overwrite earlier specified values.
 *
 * ```js
 * var extend = require('tea-extend')
 *   , exclude = extend.exclude('one', 'two');
 *
 * var a = { one: 1, three: 3 }
 *   , b = { zero: 0, two: 2 };
 *
 * var c = exclude(a, b);
 *
 * c.should.deep.equal({ three: 3, zero: 0 });
 * ```
 *
 * @param {String} each property to exclude as an argument
 * @return {Function} reusable exclude function
 * @api public
 */

Params.exclude = function() {
  var excludes = [].slice.call(arguments);

  function exclude(res, obj) {
    Object.keys(obj).forEach(function(key) {
      if (!~excludes.indexOf(key)) res[key] = obj[key];
    });
  }

  return function extendExclude() {
    var args = [].slice.call(arguments);
    var res = {};

    for (var i = 0; i < args.length; i++) {
      exclude(res, args[i]);
    }

    return res;
  };
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
  args = [].slice.call(args);
  if (args.length === 1 && 'array' === typeOf(args[0])) return args[0];
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
  var allowed = this.parse(arguments);
  var obj = {};

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
  var filtered = this.parse(arguments);
  var obj = {};

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
  var required = this.parse(arguments);
  var obj = {};

  required.forEach(function(key) {
    if (key in this.hash) return;
    throw new Error('Missing key "' + key + '"');
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
