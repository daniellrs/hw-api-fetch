# hw-api-fetch

> 

[![NPM](https://img.shields.io/npm/v/hw-api-fetch.svg)](https://www.npmjs.com/package/hw-api-fetch) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save hw-api-fetch
or
yarn add hw-api-fetch
```

## Usage

First you have to pass the properties of your api to the HWApiFetch component:

```js
import HWApiFetch from 'hw-api-fetch'

const properties = {
  host: 'https://www.yourapi.com.br/api/',
  cookiesToHeader: [{ 
    key: 'authId',
    cookie: 'authentication'
  },
  'authorization'],
  beforeReturn: [
    res => {return {...res, test: true}}
  ],
  log: true,
  hwResponse: true
}

new HWApiFetch(properties)

```

The properties are:

| Key       | Type           | Description  |
| ------------- |:-------------:| ------------- |
| host | string | The host of your api. |
| cookiesToHeader | array | Array of objects with the format {key, cookie}. If is passed a string it will be presumed that the key and the cookie are equals. If these cookies exists in the browser, it will be send with all your requests. |
| beforeReturn | array | Array of functions to be applied before the data returns. |
| log | boolean | Log api calls to the console. Default false. |
| hwResponse | boolean | Data comes with hwResponse format. Default false. |


Then you can make the calls to your api:

```js
import HWApiFetch from 'hw-api-fetch'

HWApiFetch.get('getUsers', {limit: 10}).then( response => ... )
HWApiFetch.post('newUser', {user: 'John', password: 'ILikeWaffles'}).then( response => ... )
HWApiFetch.put('editUser', {name: 'Not John', password: 'NewPassword'}).then( response => ... )
HWApiFetch.patch('editUser', {name: 'Not John'}).then( response => ... )
HWApiFetch.delete('deleteUser', {name: 'John'}).then( response => ... )
```

get, post, put, patch, delete params are:

| Param       | Type           | Description  |
| ------------- |:-------------:| ------------- |
| path | string | The path of your call. |
| data | object | The data that you want to send.  |

## License

MIT © [daniellrs](https://github.com/daniellrs)
