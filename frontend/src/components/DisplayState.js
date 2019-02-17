import React, { Component } from 'react';
import { Update } from '../net/socketio';


class DisplayState extends Component {
  constructor(props) {
    super(props);
    this.state = {
      connections: 0,
      clients: {},
      activeClaps: 0,
    }
    this.updateState = this.updateState.bind(this);

    Update(this.updateState);
  }

  updateState(state) {
    let activeClaps = 0;
    const keys = Object.keys(state.clients);
    for (let i = 0; i < keys.length; i++) {
      if (state.clients[keys[i]].claps > 0) {
        activeClaps += 1;
      }
    }
    state.activeClaps = activeClaps;
    this.setState(state);
  }

  render() {
    return (
      <div>
        <h3>Connections: {this.state.connections}</h3>
        <h3>Active Claps: {this.state.activeClaps}</h3>
        <h3>Ratio: {this.state.activeClaps / (this.state.connections || 1)}</h3>
      </div>
    );
  }


};


export default DisplayState;
