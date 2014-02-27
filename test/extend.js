test('merge', function() {
  var a = { hello: 'universe' };
  var b = { speak: 'loudly' };
  var c = params.extend(a, b);
  a.should.deep.equal({ hello: 'universe', speak: 'loudly' });
  c.should.deep.equal({ hello: 'universe', speak: 'loudly' });
});

test('overwrite', function() {
  var a = { hello: 'world' };
  var b = { hello: 'universe' };
  var c = params.extend(a, b);
  a.should.deep.equal({ hello: 'universe' });
  c.should.deep.equal({ hello: 'universe' });
});

test('merge many', function() {
  var a = { hello: 'universe' };
  var b = { speak: 'loudly' };
  var c = { language: 'en' };
  var d = params.extend(a, b, c);
  a.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
  d.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
});

test('overwrite many', function() {
  var a = { hello: 'world' };
  var b = { hello: 'universe', speak: 'softly' };
  var c = { speak: 'loudly', language: 'en' };
  var d = params.extend(a, b, c);
  a.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
  d.should.deep.equal({ hello: 'universe', speak: 'loudly', language: 'en' });
});
