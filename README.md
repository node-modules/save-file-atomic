# savefile

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/save-file-atomic.svg?style=flat-square
[npm-url]: https://npmjs.org/package/save-file-atomic
[travis-image]: https://img.shields.io/travis/node-modules/save-file-atomic.svg?style=flat-square
[travis-url]: https://travis-ci.org/node-modules/save-file-atomic
[codecov-image]: https://img.shields.io/codecov/c/github/node-modules/save-file-atomic.svg?style=flat-square
[codecov-url]: https://codecov.io/github/node-modules/save-file-atomic?branch=master
[david-image]: https://img.shields.io/david/node-modules/save-file-atomic.svg?style=flat-square
[david-url]: https://david-dm.org/node-modules/save-file-atomic
[snyk-image]: https://snyk.io/test/npm/save-file-atomic/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/save-file-atomic
[download-image]: https://img.shields.io/npm/dm/save-file-atomic.svg?style=flat-square
[download-url]: https://npmjs.org/package/save-file-atomic

Save anything to file atomic.

## Install

```bash
$ npm i save-file-atomic --save
```

## Usage

```js
const savefile = require('save-file-atomic');

// anything can be: ReadStream, Buffer, String
// target is the target file path
await savefile(anything, target);

// copy file atomic
await savefile.copy(source, target);
```

## Questions & Suggestions

Please open an issue [here](https://github.com/node-modules/save-file-atomic/issues).

## License

[MIT](LICENSE)
