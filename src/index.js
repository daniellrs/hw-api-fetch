import * as utils from './utils'
import HwResponse from './HwResponse'
import PubSub from 'pubsub-js';

export default class HWApiFetch {
  constructor(properties={}) {
    HWApiFetch.pending = {};
    HWApiFetch.properties = properties;
  }

  static get( path, data={}, requestId ) {
    const dataKeys = Object.keys(data)
    let params = ''
    dataKeys.forEach((key, index) => {
      if(index === 0) params += '?'
      params += `${key}=${data[key]}`
      if(index !== dataKeys.length-1) params += '&'
    })
    return this.send(`${path}${params}`, 'GET', undefined ,requestId)
  }

  static post( path, data, requestId ) {
    return this.send(path, 'POST', data, requestId)
  }

  static put( path, data, requestId ) {
    return this.send(path, 'PUT', data, requestId)
  }

  static patch( path, data, requestId ) {
    return this.send(path, 'PATCH', data, requestId)
  }

  static delete( path, data, requestId ) {
    return this.send(path, 'DELETE', data, requestId)
  }

  static getHeaders() {
    if(!HWApiFetch.properties.cookiesToHeader || !Array.isArray(HWApiFetch.properties.cookiesToHeader)) return
    
    const headers = {}
    HWApiFetch.properties.cookiesToHeader.forEach(e => {
      if(typeof e !== 'object') e = {key: e, cookie: e}
      const cookie = utils.getCookie(e.cookie);
      if(cookie) headers[e.key] = cookie;
    });

    return headers
  }

  static contentType(method) {
    const header = {}
    if( method === 'PATCH' ) header['Content-Type'] = 'application/json-patch+json;charset=UTF-8'
    else header['Content-Type'] = 'application/json;charset=UTF-8'
    return header;
  }

  static send(path, method, data, requestId) {
    if(requestId) {
      if(HWApiFetch.pending[requestId]) return new Promise((res, rej) => rej());
      HWApiFetch.pending[requestId] = true;
    }
    if(requestId) PubSub.publish("HW-API-REQUEST-START", {requestId});
    return fetch(`${HWApiFetch.properties.host}${path}`, {
      method: method,
      body: JSON.stringify( data ),
      headers: {...this.getHeaders(), ...this.contentType(method)},
    }).then(res => {
      if(requestId) PubSub.publish("HW-API-REQUEST-END", {requestId});
      delete HWApiFetch.pending[requestId];
      return res;
    }).then( res => res.json() ).then( res => {
      if(HWApiFetch.properties.log) console.log( method + ' > ', path, data, res )
      if(HWApiFetch.properties.beforeReturn) {
        HWApiFetch.properties.beforeReturn.forEach( f => {
          if(typeof f === 'function') res = f(res)
        })
      }
      if(HWApiFetch.properties.hwResponse) res = new HwResponse(res)
      return res;
    })
    
  }
}