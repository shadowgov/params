/**
 * Dependencies.
 */

var type = require('type-detect');

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
}

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

/**
 * ### Params.merge (destination, source, ...)
 *
 * For each source, shallow merge its key/values to the
 * destination. Sources are read in order, meaning the same
 * key in a later source will overwrite the key's value set
 * earlier.
 *
 * Also, this tool only supports objects and arrays. Furthermore,
 * the destination and all sources must be of the same type.
 *
 * ```js
 * var merge = require('tea-merge');
 *
 * // sample objects
 * var a = { hello: 'universe', arr: [ { a: 'a' } ] }
 *   , b = { speak: 'loudly', arr: [ { b: 'b' }, { c: 'c' } };
 *
 * merge(a, b);
 * a.should.deep.equal({
 *     hello: 'universe'
 *   , speak: 'loudly'
 *   , arr: [
 *         { a: 'a', b: 'b' }
 *       , { c: 'c' }
 *     ]
 * });
 * ```
 *
 * When merging objects, it is expected that if the
 * key from the source already exists in the destination,
 * the existing value in the source supports the same type of
 * iteration as in the destination. If they cannot, a
 * `Incompatible merge scenario.` error will be thrown.
 *
 * ##### Rules
 *
 * - Non-iterable values can be replaced with other
 * non-iterable values: strings, numbers, etc.
 * - Iterable values cannot replace non-iterable
 * values; objects can't replace string, arrays, can't
 * replace numbers, etc.
 * - Non-iterable values cannot replace iterable
 * values; numbers can't replace objects, strings can't
 * replace arrays, etc.
 *
 * @param {Array|Object} destination
 * @param {Array|Object} sources ...
 * @return {Object} destination merge
 * @api public
 */

Params.merge = function() {;
  var args = [].slice.call(arguments);
  var res = args[0];

  for (var i = 1; i < args.length; i++) {
    merge(res, args[i]);
  }

  return res;
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
    if (this.hash.hasOwnProperty(key)) {
      obj[key] = this.hash[key];
    }
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
  if (args.length === 1 && 'array' === type(args[0])) return args[0];
  return args
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
}

/*!
 * Start merge scenario by detecting if capable
 * and proxying to the appropriate sub-function.
 *
 * @param {Array|Object} destination
 * @param {Array|ObjectArray|Object} source
 * @return {Array|Object} destination merged
 * @api private
 */

function merge(a, b) {
  if (type(a) !== type(b)) {
    throw new Error('Incompatible merge scenario.');
  } else if ('object' === type(a)) {
    return mergeObject(a, b);
  } else if ('array' === type(a)) {
    return mergeArray(a, b);
  } else {
    throw new Error('Unsupported merge scenario');
  }
}

/*!
 * Start merge scenario for arrays.
 *
 * @param {Array} destination
 * @param {Array} source
 * @return {Array} destination merged
 * @api private
 */

function mergeArray(a, b) {
  var adds = [];
  var ai = 0;

  for (var i = 0; i < b.length; i++) {
    if (('object' === type(a[i]) && 'object' === type(b[i]))
    ||  ('array' === type(a[i]) && 'array' === type(b[i]))) {
      a[i] = merge(a[i], b[i]);
    } else if ('object' === type(b[i])) {
      adds.push(merge({}, b[i]));
    } else if ('array' === type(b[i])) {
      adds.push(merge([], b[i]));
    } else if (!~a.indexOf(b[i])) {
      adds.push(b[i]);
    }
  }

  for (; ai < adds.length; ai++) {
    a.push(adds[ai]);
  }

  return a;
}

/*!
 * Start merge scenario for objects.
 *
 * @param {Object} destination
 * @param {Object} source
 * @return {Object} destination merged
 * @api private
 */

function mergeObject (a, b) {
  var keys = Object.keys(b)
  var k;

  for (var i = 0; i < keys.length; i++) {
    k = keys[i];

    if ('object' !== type(b[k]) && 'array' !== type(b[k])) {
      // TODO: better deref handling of other types
      a[k] = b[k];
    } else {
      a[k] = a.hasOwnProperty(k)
        ? merge(a[k], b[k])
        : merge('array' === type(b[k]) ? [] : {}, b[k]);
    }
  }

  return a;
}


/**
 * Primary export.
 */

module.exports = Params;
