const net = require('net');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log('Logs from your program will appear here!');

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const dataArray = data.toString().split(`\r\n`);
    const firstLine = dataArray[0].split(' ');
    const url = firstLine[1];
    const path = url.split('/');

    const conditionFor4thStage = `/echo/`;
    if (url.startsWith(conditionFor4thStage)) {
      const status = `HTTP/1.1 200 OK`;
      const headerContentType = `Content-Type: text/plain`;
      const body = url.substring(6);
      const headerContentLength = `Content-Length:${body.length}`;
      // const header = {
      //   'Content-Type': text / plain,
      //   'Content-Length': `${randomString.length}`,
      // };

      const response = [
        status,
        headerContentType,
        headerContentLength,
        '',
        body,
      ].join('\r\n');
      // const answer4thStage = `HTTP/1.1 200 OK\r\n${header}\r\n${randomString}`;
      socket.write(response);
    } else {
      if (url === '/') {
        const response = `HTTP/1.1 200 OK\r\n\r\n`;
        socket.write(response);
      } else {
        const error = `HTTP/1.1 404 Not Found\r\n\r\n`;
        socket.write(error);
      }
    }

    l;
    // console.log(randomString);
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
