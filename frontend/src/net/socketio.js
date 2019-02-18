/* Handles voting. */
import openSocket from 'socket.io-client';
const socket = openSocket('https://clap.horn.uk');

/* Emit a clap! */
const Vote = (value) => {
  socket.emit('clap', value);
};


const Update = (cb) => {
  socket.on('update', cb);
}

export { Vote, Update };
