import React, { Component } from 'react';
import { Update } from '../net/socketio';


class DisplayState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: 0,
    }
    this.updateState = this.updateState.bind(this);

    Update(this.updateState);
  }

  updateState(state) {
    this.setState(state);
  }

  render() {
    return (
      <div>
        <h3>Connections: {this.state.connections}</h3>
      </div>
    );
  }


};


export default DisplayState;
