'use strict';

const Readable = require('stream').Readable;
const path = require('path');
const uuid = require('uuid');
const fs = require('mz/fs');
const mkdirp = require('mz-modules/mkdirp');
const rimraf = require('mz-modules/rimraf');
const pump = require('mz-modules/pump');

/**
 * Save anything to file
 * @param {String|Buffer|Readable} source - source content
 * @param {String} target - target file path
 */
async function savefile(source, target) {
  const isStream = source instanceof Readable;
  let sourceError;
  let onError;
  if (isStream) {
    onError = err => {
      sourceError = err;
    };
    source.once('error', onError);
  }

  const exists = await fs.exists(target);
  if (!exists) {
    // make sure target parent dir exists
    const parent = path.dirname(target);
    const parentExists = await fs.exists(parent);
    if (!parentExists) {
      await mkdirp(parent);
    }
  }

  if (isStream) {
    // source stream has emit error, throw it
    if (sourceError) {
      throw sourceError;
    } else {
      // remove error listener
      source.removeListener('error', onError);
    }
  }

  const tempfile = `${target}.${uuid.v1()}.savefile.tmp`;
  try {
    if (isStream) {
      const targetStream = fs.createWriteStream(tempfile);
      await pump(source, targetStream);
    } else {
      if (typeof source === 'string') {
        source = Buffer.from(source);
      }
      await fs.writeFile(tempfile, source);
    }
    // if exists, remove it first
    if (await fs.exists(target)) {
      await rimraf(target);
    }
    // atomic rename
    await fs.rename(tempfile, target);
  } catch (err) {
    // make sure tempfile remove
    await rimraf(tempfile);
    throw err;
  }
}

async function copy(source, target) {
  const stream = fs.createReadStream(source);
  await savefile(stream, target);
}

module.exports = savefile;
module.exports.copy = copy;
