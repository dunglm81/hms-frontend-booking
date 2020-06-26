import React, { Component } from 'react';

export default class AutoCompleteText extends Component {
  constructor(props) {
    super(props);
    this.items = ['mit', 'bong', 'me', 'bo', 'jumbo'];
    this.state = { suggestions: [] };
  };

  onTextChange = (event) => {

  }

  render() {
    return (
      <div>
        <input onChange={} type="text" />
        <ul>
          {this.items.map((item) => <li>{item}</li>)}
        </ul>
      </div>
    )
  }
}
