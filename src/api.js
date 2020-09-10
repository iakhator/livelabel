import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function subscribeToTimer(cb) {
  socket.emit('subscribeToTimer', 'nika');
  socket.on('subscribeToTimer', (mess) => cb(null, mess))
}
export { subscribeToTimer };
