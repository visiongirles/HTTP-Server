const net = require('net');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log('Logs from your program will appear here!');

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const dataArray = data.toString().split(`\r\n`);
    const firstLine = dataArray[0].split(' ');
    const url = firstLine[1];

    const answer = 'HTTP/1.1 200 OK\r\n\r\n';
    const error = `HTTP/1.1 404 Not Found\r\n\r\n`;

    if (url === '/') {
      socket.write(answer);
    } else {
      socket.write(error);
    }
  });

  socket.on('close', () => {
    socket.end();
    server.close();
  });
});

// server.on('connection', (socket) => {
//   socket.on('data', (data) => {
//     console.log(`${data.toString()}`);
//   });

//   const answer = 'HTTP/1.1 200 OK\r\n\r\n';
//   socket.write(answer);
// });

server.listen(4221, 'localhost');
