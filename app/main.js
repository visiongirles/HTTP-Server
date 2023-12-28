const net = require('net');
const { argv } = require('node:process');
const fsPromises = require('node:fs/promises');
const fs = require('node:fs');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log('Logs from your program will appear here!');

// Uncomment this to pass the first stage
const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    const dataArray = data.toString().split(`\r\n`);
    // console.log(dataArray);

    const [method, path, protocol] = dataArray[0].split(' ');
    const [_, userAgentInfo] = dataArray[2].split(' ');

    const condition4thStage = `/echo/`;

    const condition5thStage = '/user-agent';

    const condition7thStage = '/files/';

    if (path.startsWith(condition7thStage)) {
      const [execPath, execFile, flag, directory] = argv;

      // argv: /usr/local/bin/node,/app/app/main.js,--directory,/tmp/data/codecrafters.io/http-server-tester/
      const filename = path.substring(7);
      const filePath = `${directory}${filename}`;
      // try {const stats = await fs.stat(filePath);
      //   socket.write(response)}
      //   catch(e){}

      try {
        const stats = await fsPromises.stat(filePath);
        console.log(`Stats: ${stats}`);
        const status = `HTTP/1.1 200 OK`;
        const headerContentType = `Content-Type: application/octet-stream`;
        const headerContentLength = `Content-Length:${stats.size}`;
        const response = [
          status,
          headerContentType,
          headerContentLength,
          '',
          '',
        ].join('\r\n');
        socket.write(response);

        const readableStream = fs.createReadStream(filePath);
        // readableStream.on('error', (error) => {
        //   return;
        //   // socket.write(error);
        // });

        readableStream.on('data', (chunk) => {
          console.log('In data event');
          socket.write(chunk);
        });
      } catch (error) {
        const errorResponse = `HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\n\r\n`;
        socket.write(errorResponse);
        console.log(`Error from catch: ${error}`);
      }

      // fs.stat(filePath, (error, stats) => {
      //   if (!error) {
      //     const status = `HTTP/1.1 200 OK`;
      //     const headerContentType = `Content-Type: application/octet-stream`;
      //     const context = fs.readFile(filePath, { encoding: 'utf8' });
      //     const headerContentLength = `Content-Length:${stats.size}`;
      //     const body = fs.readFileSync();
      //     const response = [
      //       status,
      //       headerContentType,
      //       headerContentLength,
      //       '',
      //       '',
      //     ].join('\r\n');
      // socket.pipe();
      //     socket.write(response);
      // read();
      // console.log(`Файл ${filePath} существует.`);
      //   } else {
      //     const errorResponse = `HTTP/1.1 404 Not Found\r\n\r\n`;
      //     socket.write(errorResponse);
      //     // console.error(`Файл ${filePath} не существует.`);
      //   }
      // });
    } else if (path.startsWith(condition5thStage)) {
      const status = `HTTP/1.1 200 OK`;
      const headerContentType = `Content-Type: text/plain`;
      const body = userAgentInfo;
      const headerContentLength = `Content-Length:${body.length}`;
      const response = [
        status,
        headerContentType,
        headerContentLength,
        '',
        body,
      ].join('\r\n');
      socket.write(response);
    } else if (path.startsWith(condition4thStage)) {
      const status = `HTTP/1.1 200 OK`;
      const headerContentType = `Content-Type: text/plain`;
      const body = path.substring(6);
      const headerContentLength = `Content-Length:${body.length}`;
      const response = [
        status,
        headerContentType,
        headerContentLength,
        '',
        body,
      ].join('\r\n');
      socket.write(response);
    } else {
      if (path === '/') {
        const status = `HTTP/1.1 200 OK\r\n`;
        const header = `Content-Length: 0\r\n\r\n`;
        socket.write(status + header);
      } else {
        const error = `HTTP/1.1 404 Not Found\r\n\r\n`;
        socket.write(error);
      }
    }
  });

  socket.on('close', () => {
    socket.end();
    server.close();
  });
});

server.listen(4221, 'localhost');
