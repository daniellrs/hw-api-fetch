import * as utils from './utils'
import HwResponse from './HwResponse'

export default class HWApiFetch {
  constructor(properties={}) {
    HWApiFetch.properties = properties
  }

  static get( path, data={} ) {
    const dataKeys = Object.keys(data)
    let params = ''
    dataKeys.forEach((key, index) => {
      if(index === 0) params += '?'
      params += `${key}=${data[key]}`
      if(index !== dataKeys.length-1) params += '&'
    })
    return this.send(`${path}${params}`, 'GET')
  }

  static post( path, data ) {
    return this.send(path, 'POST', data)
  }

  static put( path, data ) {
    return this.send(path, 'PUT', data)
  }

  static patch( path, data ) {
    return this.send(path, 'PATCH', data)
  }

  static delete( path, data ) {
    return this.send(path, 'DELETE', data)
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

  static send(path, method, data) {
    return fetch(`${HWApiFetch.properties.host}${path}`, {
      method: method,
      body: JSON.stringify( data ),
      headers: {...this.getHeaders(), ...this.contentType(method)},
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