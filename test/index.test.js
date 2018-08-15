'use strict';

const mm = require('mm');
const path = require('path');
const assert = require('assert');
const fs = require('mz/fs');
const rimraf = require('mz-modules/rimraf');
const savefile = require('..');

const fixtures = path.join(__dirname, 'fixtures');
const temp = path.join(fixtures, 'tmp');

describe('test/index.test.js', () => {
  function cleanup() {
    return rimraf(temp);
  }

  beforeEach(cleanup);
  afterEach(cleanup);
  afterEach(mm.restore);

  describe('savefile()', () => {
    it('should support String', async () => {
      const source = 'This is a ascii string with emoji 😊, and 哈哈, 123';
      const target = path.join(temp, 'string-target.txt');
      await savefile(source, target);
      const targetContent = await fs.readFile(target, 'utf8');
      assert(source === targetContent);
    });

    it('should support Buffer', async () => {
      const source = Buffer.from('This is a ascii string with emoji 😊, and 哈哈, 123');
      const target = path.join(temp, 'foo/bar/buffer-target.txt');
      await savefile(source, target);
      const targetContent = await fs.readFile(target, 'utf8');
      assert(source.toString() === targetContent);
    });

    it('should support Stream', async () => {
      const sourceFile = path.join(fixtures, 'source.txt');
      const source = fs.createReadStream(sourceFile);
      const target = path.join(temp, 'stream-target.txt');
      await savefile(source, target);
      const sourceContent = await fs.readFile(sourceFile, 'utf8');
      const targetContent = await fs.readFile(target, 'utf8');
      assert(sourceContent === targetContent);
    });

    it('should override exists target', async () => {
      const sourceFile = path.join(fixtures, 'source.txt');
      const source = fs.createReadStream(sourceFile);
      const target = path.join(temp, 'stream-target.txt');
      await savefile(source, target);
      const sourceContent = await fs.readFile(sourceFile, 'utf8');
      const targetContent = await fs.readFile(target, 'utf8');
      assert(sourceContent === targetContent);

      // again should work
      const source2 = fs.createReadStream(sourceFile);
      await savefile(source2, target);
      const target2Content = await fs.readFile(target, 'utf8');
      assert(sourceContent === target2Content);
    });

    it('should concurrency savefile same file', async () => {
      const sourceFile = path.join(fixtures, 'source.txt');
      const target = path.join(temp, '1/2/3/4/5/6/7/8/9/10/concurrency-target.txt');

      await Promise.all([
        savefile(fs.createReadStream(sourceFile), target),
        savefile(fs.createReadStream(sourceFile), target),
        savefile(fs.createReadStream(sourceFile), target),
        savefile(fs.createReadStream(sourceFile), target),
        savefile(fs.createReadStream(sourceFile), target),
        savefile(fs.createReadStream(sourceFile), target),
      ]);

      const sourceContent = await fs.readFile(sourceFile, 'utf8');
      const targetContent = await fs.readFile(target, 'utf8');
      assert(sourceContent === targetContent);
    });

    it('should throw error when source stream error', async () => {
      const sourceFile = path.join(fixtures, 'source-not-exists.txt');
      const target = path.join(temp, 'stream-target.txt');
      try {
        await savefile(fs.createReadStream(sourceFile), target);
        throw new Error('should not run this');
      } catch (err) {
        assert(err.code === 'ENOENT');
        assert(err.message.includes('no such file or directory'));
      }
    });

    it('should remove tempfile when rename error', async () => {
      const source = path.join(fixtures, 'source.txt');
      const target = path.join(temp, 'stream-target.txt');
      mm(fs, 'rename', async () => {
        throw new Error('mock error');
      });
      try {
        await savefile(source, target);
        throw new Error('should not run this');
      } catch (err) {
        assert(err.message === 'mock error');
      }
      assert((await fs.readdir(temp)).length === 0);
    });
  });

  describe('.copy()', () => {
    it('should copy file success', async () => {
      const source = path.join(fixtures, 'source.txt');
      const target = path.join(temp, 'copy-target.txt');
      await savefile.copy(source, target);
      const sourceContent = await fs.readFile(source, 'utf8');
      const targetContent = await fs.readFile(target, 'utf8');
      assert(sourceContent === targetContent);
    });

    it('should support not exists parent dir', async () => {
      const source = path.join(fixtures, 'source.txt');
      const target = path.join(temp, '1/2/3/4/5/6/7/9/10/copy-target.txt');
      await savefile.copy(source, target);
      let sourceContent = await fs.readFile(source, 'utf8');
      let targetContent = await fs.readFile(target, 'utf8');
      assert(sourceContent === targetContent);

      // again should work
      await rimraf(target);
      await savefile.copy(source, target);
      sourceContent = await fs.readFile(source, 'utf8');
      targetContent = await fs.readFile(target, 'utf8');
      assert(sourceContent === targetContent);
    });
  });
});
