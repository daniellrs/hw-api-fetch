import React, { Component } from 'react'

import HWApiFetch from '../../dist'

export default class App extends Component {

  componentDidMount = async () => {
    const response = await HWApiFetch.get( 'saldo/custos-sistema', {param1: 'hello', param2: true} )
    console.log(response);
  }

  render () {
    return (
      <div>
      </div>
    )
  }
}
