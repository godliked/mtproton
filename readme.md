# mtproton

[![NPM](https://img.shields.io/npm/v/mtproton.svg?style=flat-square)](https://www.npmjs.com/package/mtproton)
[![Downloads](https://img.shields.io/npm/dm/mtproton?style=flat-square)](https://www.npmjs.com/package/mtproton)

Telegram API JS (MTProto) client library for browser and nodejs

* **Actual.** 133 layer in the API scheme
* **Fast.** For the Node.js, it uses the TCP and crypto module. For the browser, it uses WebSocket and window.crypto
* **Easy.** Cryptography and bytes is hidden. [Just make requests](#mtprotocallmethod-params-options--promise) to the API
* **Smart.** Automatically [sync authorization](#optionssyncauth-boolean) on all DC's
* **Events.** [Subscribe to updates](#mtprotoupdatesonupdates-listener) via the EventEmitter API
* **2FA.** Use the [library's built-in function](#getsrpparams-g-p-salt1-salt2-gb-password----a-m1-) to calculate 2FA parameters
* **Secure.** Complies with Telegram security guidelines

## Install
```sh
npm i mtproton -E
```

## Quick start

You need **api_id** and **api_hash**. If you do not have them yet, then get them according to the official instructions: [creating your Telegram application](https://core.telegram.org/api/obtaining_api_id).

```js
const path = require('path');
const MTProto = require('mtproton');

const api_id = YOU_API_ID;
const api_hash = YOU_API_HASH;

// 1. Create instance
const mtproto = new MTProto({
  api_id,
  api_hash,

  storageOptions: {
    path: path.resolve(__dirname, './data/1.json'),
  },
});

// 2. Print the user country code
mtproto.call('help.getNearestDc').then(result => {
  console.log('country:', result.country);
});
```

## Guides

- [Authentication](docs/authentication.md)
- [Handling common errors](docs/handling-common-errors.md)

## API

### `new MTProto({ api_id, api_hash, test, storageOptions }) => mtproto`

#### `api_id: number` and `api_hash: string` and `storageOptions: { path: string, instance: object }`
**api_id** and **api_hash** are required. If you do not have them yet, then get them according to the official instructions: [creating your Telegram application](https://core.telegram.org/api/obtaining_api_id).

#### `test: boolean`
Default: `false`. Use test data centers. On test servers, you can use [test phone numbers](https://core.telegram.org/api/auth#test-phone-numbers).

#### `storageOptions: { instance?: customLocalStorage, path?: 'path to json storage file' }`
We have default storages. The storage is used to store the session (authentication keys, server salts and time offset). Depending on the environment, you need to pass different parameters for the storage. But you can also use custom storage
## For `node` environment
In the storageOptions.path, pass the absolute path to the json file through the constructor
```js
new MTProto({
  storageOptions: {
    path: path.resolve(__dirname, './data/1.json'),
  },
});
```
## For `browser` environment
The window.localStorage is used for storage. You don't need to pass storageOptions
## Custom Storage
```ts
class CustomStorage {
  set(key: string, value: string): Promise<void>;
  get(key: string): Promise<string|null>;
}
```
```js
const instance = new CustomStorage();

new MTProto({
  storageOptions: {
    instance,
  },
});
```

We have ready-made storage:
1. `tempStorage` only stores data while the script is running

Example:
```js
const tempStorage = require('mtproton/core/src/storage/temp');

new MTProto({
  storageOptions: {
    instance: tempStorage,
  },
});
```

### `mtproto.call(method, params, options) => Promise`

#### `method: string`
Method name from [methods list](https://core.telegram.org/methods).

#### `params: object`
Parameters for `method` from `https://core.telegram.org/method/{method}#parameters`.

1. If the method needs the `flags` parameter, `flags` is calculated automatically 🙃

2. If you need to pass a constructor use `_`. Example for [users.getFullUser](https://core.telegram.org/method/users.getFullUser#parameters):
```js
const params = {
  id: {
    _: 'inputUserSelf',
  },
};
```

#### `options.dcId: number`
Specific DC id. By default, it is `2`. You can change the default value using [mtproto.setDefaultDc](#mtprotosetdefaultdcdcid) method.

#### `options.syncAuth: boolean`
Default: `true`. Copy authorization to all DC if the response contains `auth.authorization`.

#### Example:
```js
mtproto.call('help.getNearestDc', {}, {
  dcId: 1
}).then(result => {
  console.log('result:', result);
  // { _: 'nearestDc', country: 'RU', this_dc: 1, nearest_dc: 2 }
}).catch(error => {
  console.log('error.error_code:', error.error_code);
  console.log('error.error_message:', error.error_message);
});
```

### `mtproto.updates.on(updates, listener)`
Method for handles [updates](https://core.telegram.org/type/Updates).

Example of handling a [updateShort](https://core.telegram.org/constructor/updateShort) with [updateUserStatus](https://core.telegram.org/constructor/updateUserStatus):
```js
mtproto.updates.on('updateShort', message => {
  const { update } = message;

  if (update._ === 'updateUserStatus') {
    const { user_id, status } = update;

    console.log(`User with id ${user_id} change status to ${status}`);
  }
});
```

### `mtproto.setDefaultDc(dcId) => Promise`
If a [migration error](https://core.telegram.org/api/errors#303-see-other) occurs, you can use this function to change the default [data center](https://core.telegram.org/api/datacenter). You can also use [options.dcId](#optionsdcid-number).

See the example in the [authentication](docs/authentication.md).

### `mtproto.updateInitConnectionParams(params)`
Provide params for [initConnection](https://core.telegram.org/method/initConnection#parameters) method. **I recommend** running this function immediately after [creating an instance of MTProto](#new-mtproto-api_id-api_hash-test-customlocalstorage---mtproto).


See the example in the [quick start](#quick-start).

### `getSRPParams({ g, p, salt1, salt2, gB, password }) => { A, M1 }`

Function to calculate parameters for 2FA (Two-factor authentication). For more information about parameters, see the [article on the Telegram website](https://core.telegram.org/api/srp).

See the example in the [authentication](docs/authentication.md).

## Useful references

- API methods — https://core.telegram.org/methods
- API schema — https://core.telegram.org/schema
