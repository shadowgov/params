
/*!
 * Internal dependencies.
 */

var params = require('..');

/*!
 * Fixture.
 */

var fixture = { foo: 'bar', baz: 'zo', cl: 'fn' };

describe('params', function() {
  it('can build a new object, containing only given keys', function() {
    var actual = null

    actual = params(fixture).only('foo', 'baz');
    actual.should.eql({ foo: 'bar', baz: 'zo' });

    actual = params(fixture).only(['foo', 'baz']);
    actual.should.eql({ foo: 'bar', baz: 'zo' });
  });

  it('can buld a new object, containing all keys except the supplied', function() {
    var actual = null;

    actual = params(fixture).except('foo', 'baz');
    actual.should.eql({ cl: 'fn' });

    actual = params(fixture).except(['foo', 'baz']);
    actual.should.eql({ cl: 'fn' });
  });

  it('throws an error if required key is missing', function() {
    var actual = null
      , err = null

    try {
      actual = params(fixture).require('missing');
    } catch (e) {
      err = e;
    } finally {
      err.message.should.eq('Missing key "missing" for { foo: \'bar\', baz: \'zo\', cl: \'fn\' }')
      err = null;
    }

    try {
      actual = params(fixture).require('foo');
    } catch (e) {
      err = e;
    } finally {
      (err === null).should.be.true;
    }
  });

  it('can mutate the supplied object by removing the supplied keys', function() {
    var fixture = { foo: 'bar', baz: 'zo', cl: 'fn' };

    params(fixture)
      .permit('foo')
      .permit('baz')
      .slice();

    fixture.should.eql({ foo: 'bar', baz: 'zo' });
  });
});
