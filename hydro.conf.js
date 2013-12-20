module.exports = function(hydro) {
  hydro.set({
    attach: global,
    formatter: 'hydro-dot',
    globals: {
      params: require('./index')
    },
    plugins: [
      'hydro-chai'
    ],
    chai: {
      styles: [ 'should' ],
      showDiff: true,
      showStack: true
    },
    suite: 'params',
    proxies: {
      test: 'addTest'
    },
    tests: [
      'test/*.js'
    ]
  });
};
