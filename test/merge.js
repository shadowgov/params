test('merge simple objects', function() {
  var a = {
    foo: 'bar',
    baz: { bing: 'beep' }
  };

  var b = {
    foo: 'zoo',
    baz: { you: 'too' }
  };

  var c = params.merge(a, b);

  c.should.eql({
    foo: 'zoo',
    baz: { bing: 'beep', you: 'too' }
  });
});

test('merge arrays', function() {
  var a = [ { 'a': 1 }, 2 ];
  var b = [ { 'b': 3 }, 4 ];
  var c = params.merge(a, b);
  c.should.eql([ { a: 1, b: 3 }, 2, 4 ]);
});

test('merge nested arrays', function() {
  var a = { foo: [ { bar: 'baz' }, 2, { you: 'too' }   ], bing: 'beep' };
  var b = { foo: [ { too: 'you' }, 4, { bing: 'beep' } ], bing: 'bop', beep: 'boop' };
  var c = params.merge(a, b);

  c.should.eql({
    foo: [
      { bar: 'baz', too: 'you'  },
      2,
      { you: 'too', bing: 'beep' },
      4
    ],
    bing: 'bop',
    beep: 'boop'
  });
});

test('merge complex nested objects', function() {
  var a = {
    b: {
      c: {
        d: 'hello universe'
      }
    }
  }

  var b = params.merge({}, a);
  b.should.eql({ b: { c: { d: 'hello universe' } } });
});
