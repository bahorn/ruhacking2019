import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import DSP from '../deps/dsp.js/dsp';

import { Vote } from '../net/socketio';


/* Uses the Web Audio API, with docs available here:
 * https://developers.google.com/web/fundamentals/media/recording-audio/ */
class AudioController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      threshold: 0.015,
      clapping: '',
      last: Date.now(),
      stream: null,
      spectrum: {
        datasets: [
          {
            data: [],
          }
        ],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              suggestedMin: 0,
              suggestedMax: 0.5,
              min: 0,
              max: 0.5,
            }
          }]
        }
      },
    };

    this.audioEnabled = this.audioEnabled.bind(this);
    this.processAudio = this.processAudio.bind(this);
    /* Setup websocket connection */

    /* Ask for an audio stream */
    navigator
      .mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then(this.audioEnabled);
  }

  /* Callback used when we get approved for audio */
  audioEnabled(stream) {
    this.setState({
      stream: stream,
    });
    /* Setup our handler */
    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    const processor = context.createScriptProcessor(256, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = this.processAudio;
  }

  /* Callback used for processing audio. Gets passed AudioBuffer */
  processAudio(e) {
    let clapping = this.state.clapping;
    let last = this.state.last;
    const buffer = e.inputBuffer;
    /* Clear the last detected clap emoji if over a second ago */
    if (Date.now() > last+3000) {
      clapping = '';
    }

    /* Get the meta data */
    const { length, duration, sampleRate, numberOfChannels } = buffer;
    const channels = []
    for (let i = 0; i < numberOfChannels; i++) {
      channels.push(buffer.getChannelData(i));
    }
    /* Do the DSP */
    /* High pass first */
    /* FFT */
    const fft = new DSP.FFT(length, sampleRate);
    fft.forward(channels[0]);
    const sum = fft.spectrum.reduce((a, b) => { return a + b});
    if ((sum/fft.spectrum.length) > this.state.threshold) {
      console.log('SENT');
      Vote('wow');
      clapping = '👏';
      last = Date.now();
    }
    this.setState({
      clapping,
      last,
      spectrum: {
        datasets: [
          {
            label: 'Spectrum',
            data: [].slice.call(fft.spectrum),
          }
        ]
      }
    });
  }

  render() {
    /* Display an error until the user enables their microphone. */
    let active = <h1>Please Enable The Microphone</h1>;
    if (this.state.stream != null) {
      active = <div />;
    }
    return (
      <div>
        {active}
        <h2>Audio Spectrum {this.state.clapping}</h2>
        <Line
          data={this.state.spectrum}
          options={this.state.options}
        />
          </div>
    )
  }
}

export default AudioController;
