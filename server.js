const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const socketIO = require('socket.io');
const rp = require('request-promise');
const request = require('request');
var allowedOrigins = 'http://localhost:* http://127.0.0.1:*';

const app = express();
// Connect Database
connectDB();

// Init Middleware

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/game', require('./routes/api/game'));

const server = http.createServer(app);

// socket.io

const options = {
  uri: 'http://jservice.io/api/random',
  json: true
};

const io = socketIO(server, {
  origins: allowedOrigins
});

io.on('connection', socket => {
  socket.on('begin game', isPlaying => {
    console.log('Game beginning...');
    io.sockets.emit('begin game', isPlaying);
  });

  socket.on('get question', () => {
    rp(options)
      .then(question => {
        console.log(question);
        io.sockets.emit('get question', question);
      })
      .catch(err => {
        console.log(err);
        io.sockets.emit('error', err);
      });
    // request('http://jservice.io/api/random', (err, response, body) => {
    //   console.log('error: ', err);
    //   console.log('Status code: ', response && response.statusCode);
    //   console.log('body: ', body);
    // });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

// end socket.io

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
