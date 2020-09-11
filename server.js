const io = require('socket.io')();

io.on('connection', (client) => {
  client.on('labelling', (selectedItem) => {
    io.emit('labelling', selectedItem)
  });
});

const port = 8000;
io.listen(port)
console.log('listening on port', port)
