const net = require('net');
const { argv } = require('node:process');
const fsPromises = require('node:fs/promises');
const fs = require('node:fs');

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log('Logs from your program will appear here!');

function createResponse(status, headerContentType, body, bodySize) {
  const responseStatus = `HTTP/1.1 ${status}`;
  const responseHeaderContentType = `Content-Type: ${headerContentType}`;
  const responseHeaderContentLength = `Content-Length: ${bodySize}`;
  const responseHeaders =
    headerContentType === ''
      ? responseHeaderContentLength
      : responseHeaderContentLength + '\r\n' + responseHeaderContentType;

  const responseBody = body;
  const response = [responseStatus, responseHeaders, '', responseBody].join(
    '\r\n'
  );

  return response;
}

const server = net.createServer((socket) => {
  socket.on('data', async (data) => {
    const requestArray = data.toString().split(`\r\n`);
    const [method, path, protocol] = requestArray[0].split(' ');
    const [_, userAgentInfo] = requestArray[2].split(' ');
    const condition4thStage = `/echo/`;

    const condition5thStage = '/user-agent';

    const condition7thStage = '/files/';

    if (path.startsWith(condition7thStage)) {
      const [execPath, execFile, flag, directory] = argv;
      const filename = path.substring(7);
      const filePath = `${directory}${filename}`;

      switch (method) {
        case 'GET': {
          // argv: /usr/local/bin/node,/app/app/main.js,--directory,/tmp/data/codecrafters.io/http-server-tester/

          try {
            const stats = await fsPromises.stat(filePath);
            // console.log(`Stats: ${stats}`);
            const response = createResponse(
              '200 OK',
              'application/octet-stream',
              '',
              stats.size
            );
            // const status = `HTTP/1.1 200 OK`;
            // const headerContentType = `Content-Type: `;
            // const headerContentLength = `Content-Length:${stats.size}`;
            // const response = [
            //   status,
            //   headerContentType,
            //   headerContentLength,
            //   '',
            //   '',
            // ].join('\r\n');
            socket.write(response);

            const readableStream = fs.createReadStream(filePath);
            readableStream.on('data', (chunk) => {
              console.log('In data event');
              socket.write(chunk);
            });
          } catch (error) {
            console.log(`Error from catch: ${error}`);
            const errorResponse = createResponse('404 Not Found', '', '', 0);
            socket.write(errorResponse);
          }
          break;
        }
        case 'POST': {
          break;
        }
        default:
          break;
      }
    } else if (path.startsWith(condition5thStage)) {
      const response = createResponse(
        '200 OK',
        'text/plain',
        userAgentInfo,
        userAgentInfo.length
      );
      // const status = `HTTP/1.1 200 OK`;
      // const headerContentType = `Content-Type: `;
      // const body = userAgentInfo;
      // const headerContentLength = `Content-Length:${body.length}`;
      // const response = [
      //   status,
      //   headerContentType,
      //   headerContentLength,
      //   '',
      //   body,
      // ].join('\r\n');
      socket.write(response);
    } else if (path.startsWith(condition4thStage)) {
      const body = path.substring(6);
      const response = createResponse(
        '200 OK',
        'text/plain',
        body,
        body.length
      );

      socket.write(response);
    } else {
      if (path === '/') {
        const response = createResponse('200 OK', '', '', 0);
        // const status = `HTTP/1.1 200 OK\r\n`;
        // const header = `Content-Length: 0\r\n\r\n`;
        // socket.write(status + header);
        socket.write(response);
      } else {
        // const error = `HTTP/1.1 404 Not Found\r\n\r\n`;
        const error = createResponse('404 Not Found', '', '', 0);
        socket.write(error);
      }
    }
  });

  socket.on('close', () => {
    console.log(`On close event`);
    socket.end();
    server.close();
  });
});

server.listen(4221, 'localhost');
