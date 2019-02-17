import React, { Component } from 'react';
import P5Wrapper from 'react-p5-wrapper';

import DisplayState from '../components/DisplayState';

class HomePage extends Component {
  render() {
    return (
      <div>
        <h1>Head to applause-review.com/controller</h1>
        <h2>Please clap to control the game!</h2>
        <hr />
        <iframe src="https://giphy.com/embed/l0NwPo3VHujpJDI4w" width="480" height="279" frameBorder="0" class="giphy-embed" allowFullScreen></iframe><p><a href="https://giphy.com/gifs/justin-jeb-bush-please-clap-applause-l0NwPo3VHujpJDI4w">via GIPHY</a></p>
        <hr />
        <DisplayState />
      </div>
    );
  }
}

export default HomePage;
