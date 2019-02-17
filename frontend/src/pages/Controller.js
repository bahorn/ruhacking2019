import React, { Component } from 'react';
import AudioController from '../components/AudioController';
import DisplayState from '../components/DisplayState';

class ControllerPage extends Component {
  render() {
    return (
      <div>
        <DisplayState />
        <hr />
        <AudioController />
      </div>
    );
  }
}

export default ControllerPage;
