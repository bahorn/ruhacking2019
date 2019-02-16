import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';

import DSP from '../deps/dsp.js/dsp';


/* Uses the Web Audio API, with docs available here:
 * https://developers.google.com/web/fundamentals/media/recording-audio/ */
class AudioController extends Component {
  constructor(props) {
    super(props);

    this.state = {
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
              suggestedMax: 0.005,
              min: 0,
              max: 0.05,
            }
          }]
        }
      },
    };

    this.audioEnabled = this.audioEnabled.bind(this);
    this.processAudio = this.processAudio.bind(this);

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
    const processor = context.createScriptProcessor(512, 1, 1);

    source.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = this.processAudio;
  }

  /* Callback used for processing audio. Gets passed AudioBuffer */
  processAudio(e) {
    const buffer = e.inputBuffer;
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
    console.log(((sum/fft.spectrum.length)>0.02));
    this.setState({
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
        <Line
          data={this.state.spectrum}
          options={this.state.options}
          height={75}
        />
          </div>
    )
  }
}

export default AudioController;