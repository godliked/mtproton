const Configstore = require('configstore');
const baseDebug = require('../../utils/common/base-debug');

const debug = baseDebug.extend('storage');

function getLocalStorage(options) {
  if (!options.path) {
    throw new Error('Specify the storageOptions.path for storing session');
  }

  const localStorage = new Configstore(
    'mtproton',
    {},
    {
      configPath: options.path,
    }
  );

  debug(`session located in ${localStorage.path}`);

  return localStorage;
}

module.exports = getLocalStorage;
