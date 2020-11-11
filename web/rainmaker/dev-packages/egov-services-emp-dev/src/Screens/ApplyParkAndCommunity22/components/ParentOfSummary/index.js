import React, { Component } from 'react'

export default class index extends Component {
componentDidMount(){
  alert("hello parent Component")
}
  render() {
    return (
      <div>
        <h1>hello parent one !</h1>
      </div>
    )
  }
}
