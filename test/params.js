/*!
 * Fixture.
 */

var fixture = { foo: 'bar', baz: 'zo', cl: 'fn' };

test('params(x).only(y)', function() {
  var actual = null;

  actual = params(fixture).only('foo', 'baz');
  actual.should.eql({ foo: 'bar', baz: 'zo' });

  actual = params(fixture).only(['foo', 'baz']);
  actual.should.eql({ foo: 'bar', baz: 'zo' });

  actual = params(fixture).only('foo', 'baz', 'not_defined');
  actual.should.eql({ foo: 'bar', baz: 'zo' });
});

test('params(x).except(y)', function() {
  var actual = null;

  actual = params(fixture).except('foo', 'baz');
  actual.should.eql({ cl: 'fn' });

  actual = params(fixture).except(['foo', 'baz']);
  actual.should.eql({ cl: 'fn' });
});

test('params(x).require(y)', function() {
  (function() {
    params(fixture).require('missing');
  }).should.throw('Missing key "missing"');

  (function() {
    params(fixture).require('foo');
  }).should.not.throw();
});

test('params(x).permit(y).slice()', function() {
  var fixture = { foo: 'bar', baz: 'zo', cl: 'fn' };

  params(fixture)
    .permit('foo')
    .permit('baz')
    .slice();

  fixture.should.eql({ foo: 'bar', baz: 'zo' });
});

test('params(x, y, z).permit([x, y]).slice()', function() {
  var fixture = { foo: 'bar', baz: 'zo', cl: 'fn' };

  params(fixture)
    .permit(['foo', 'baz'])
    .slice();

  fixture.should.eql({ foo: 'bar', baz: 'zo' });
});
