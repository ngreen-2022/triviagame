const express = require('express');
const connectDB = require('./config/db');
const http = require('http');
const socketIO = require('socket.io');
const rp = require('request-promise');
const request = require('request');
const axios = require('axios');
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
  socket.on('new player', room => {
    console.log('new player to: ' + room);
    socket.to(room).emit('player load');
  });

  socket.on('update_scores', room => {
    socket.to(room).emit('give_scores');
  });

  socket.on('room', room => {
    console.log('joining room: ' + room);
    socket.join(room);
  });

  // BUG ON LEAVE_PAGE
  // What - When a player leaves the game room, remaining players do not receive updated questions
  // Why - This function below is removing ALL sockets from that room, we only need to remove the socket id
  //        of the leaving player
  // FIX??? idk why but sessionid seems to work
  // MORE TESTING NEEDED*****

  socket.on('leave_page', room => {
    const sessionID = socket.id;
    console.log('sesh id: ' + sessionID);
    socket.leave(room);
    console.log('leave_room hit');
    io.of('/')
      .in(room)
      .clients(function(error, clients) {
        if (clients.length > 0) {
          console.log('clients in the room: \n');
          console.log(clients);
          clients.forEach(function(socket_id) {
            if (socket_id === sessionID) {
              io.sockets.sockets[socket_id].leave(room);
            }
          });
        }
      });
    socket.to(room).emit('player_left');
    io.in(room).clients((error, clients) => {
      if (error) throw error;
      console.log('after leaving clients: ' + clients);
    });
  });

  socket.on('kill_socket', room => {
    socket.leave(room);
  });

  socket.on('disconnect', room => {
    console.log('Leaving room: ' + room);
    socket.leave(room);
    console.log('user disconnected');
  });

  socket.on('begin game', room => {
    console.log('Game beginning...');
    console.log(room);
    socket.to(room).emit('start game');
  });

  socket.on('get question', async room => {
    console.log('in room: ' + room);
    console.log('clients');
    io.in(room).clients((error, clients) => {
      if (error) throw error;
      console.log(clients);
    });
    try {
      const res = await axios.put(`http://localhost:5000/api/game/${room}`);

      console.log(res.data.curQuestion);

      socket.to(room).emit('give question', res.data.curQuestion);
    } catch (err) {
      console.log('error' + err.message);
    }
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
