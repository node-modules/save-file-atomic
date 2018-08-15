'use strict';

module.exports = {
  write: true,
  prefix: '^',
  test: [
    'test',
    'benchmark',
  ],
  devdep: [
  ],
  exclude: [
    './test/fixtures',
    './docs',
    './coverage',
  ],
};
