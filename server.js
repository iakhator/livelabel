const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('subscribeToTimer', (interval) => {
    console.log('client is subscribing to timer with interval ', interval);
    client.emit('timer', interval);
  });
});

const port = 8000;
io.listen(port)
console.log('listening on port', port)
