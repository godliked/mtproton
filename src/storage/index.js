const { getLocalStorage } = require('./local');

// @TODO: Rename to store
class Storage {
  constructor(customLocalStorage, options) {
    this.cache = {};

    this.localStorage = customLocalStorage || getLocalStorage(options);
  }

  async set(key, value) {
    this.cache[key] = value;

    const result = await this.localStorage.set(key, JSON.stringify(value));

    return result;
  }

  async get(key) {
    if (key in this.cache) {
      return this.cache[key];
    }

    const fromLocalStorage = await this.localStorage.get(key);

    if (fromLocalStorage) {
      this.cache[key] = JSON.parse(fromLocalStorage);

      return this.cache[key];
    }

    return null;
  }
}

module.exports = { Storage };
