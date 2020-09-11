const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('subscribeToTimer', (selectedItem) => {
    io.emit('subscribeToTimer', selectedItem)
  });
});

const port = 8000;
io.listen(port)
console.log('listening on port', port)
