const http = require('http');
const app = require('./app');
const { createHandler } = require('graphql-http/lib/use/http');
const { schema } = require('./api/graphql/schema');

const handler = createHandler({ schema });
const port = process.env.port || 5000;

// const server = http.createServer((req, res) =>{
//     if (req.url.startsWith('/graphql')) {
//         handler(req, res);
//       }
// },
//  app);
const server = http.createServer(app);
server.listen(port);