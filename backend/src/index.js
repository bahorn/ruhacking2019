/* eslint no-console: 0 */
const io = require('socket.io')();

const state = {
  connections: 0,
  clients: {},
};

io.on('connection', (client) => {
  state.connections += 1;
  state.clients[client.id] = {
    claps: 0,
  };

  /* Track the amount of claps we get. */
  client.on('clap', () => {
    state.clients[client.id].claps += 1;
    /* Remove after half a second */
    setTimeout(() => {
      try {
        state.clients[client.id].claps -= 1;
      } catch (err) {
        /* Connection probably ended and this call back was just left. */
        console.log(err);
      }
    }, 300);
  });

  /* Remove ourselves. */
  client.on('disconnect', () => {
    state.connections -= 1;
    delete state.clients[client.id];
  });
});

/* Trigger an emit of the current value */
const updateEmitter = () => {
  io.emit('update', state);
  setTimeout(updateEmitter, 50);
};

const port = 8000;
io.listen(port);
console.log(`Listening on ${port}`);

updateEmitter();
