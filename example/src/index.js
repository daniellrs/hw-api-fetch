import React from 'react'
import ReactDOM from 'react-dom'

import './index.css'
import App from './App'

import HWApiFetch from '../../dist'

new HWApiFetch({
  host: 'https://www.flexypoints.com.br/api/',
  ws: 'wss://www.flexypoints.com.br/websocket/',
  cookiesToHeader: [{ 
    key: 'authId',
    cookie: 'authentication'
  },
  'authorization'],
  beforeReturn: [
    res => {return {...res, test: true}}
  ],
  log: true,
  hwResponse: true,
})

ReactDOM.render(<App />, document.getElementById('root'))
