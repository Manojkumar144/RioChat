const dotenv =require("dotenv");
dotenv.config()
const path = require ('path');
const express = require('express');
const app = express();
const sequelize = require('./util/database');
const cors = require('cors');
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const GroupMembers = require('./models/groupMembers');
const http = require("http");
const socketIo = require("socket.io");
const server = http.createServer(app);
const io = socketIo(server);
const port = process.env.PORT||3000;


app.set('views', 'views');

app.use(
    cors({
        origin:"*",
    })
)

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.json());

app.use('/', require('./routes/user'));
app.use('/', require('./routes/group'));

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, {
  through: GroupMembers,
  foreignKey: 'userId', // Specify the foreign key column for User
  otherKey: 'groupId', // Specify the foreign key column for Group
});

Group.belongsToMany(User, {
  through: GroupMembers,
  foreignKey: 'groupId', // Specify the foreign key column for Group
  otherKey: 'userId', // Specify the foreign key column for User
});

Group.hasMany(Chat, { foreignKey: 'groupId' });
Chat.belongsTo(Group, { foreignKey: 'groupId' });

app.get('/', async (req, res) => {
  try {
    res.sendFile(path.join(__dirname, './views', 'index.html'))

  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// // Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join group', (groupId) => {
    socket.join(groupId);
    console.log(`User joined group: ${groupId}`);
  });

  socket.on('chat message', async (msg) => {
    console.log("..inside the app.js socket....message :",msg);
    const { groupId, chatInput,username } = msg;
    console.log(`Message received: ${chatInput} in group: ${groupId}`);

    // Broadcast the message to all users in the group
    io.to(groupId).emit('chat message', {
      name: username, 
      message: chatInput,
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Synchronize models with the database
sequelize.sync()
  .then(() => {
    console.log('Database synchronized');
    // Start the server after the database synchronization is complete
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error synchronizing models with the database:', error);
  });