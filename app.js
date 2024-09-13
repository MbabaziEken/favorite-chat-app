const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const authRoutes = require('./routes/auth');
const http = require('http');
const socketIO = require('socket.io'); 
const chatRoutes = require('./routes/chat');
const path = require('path');
require('./config/passport');

const app = express();
const server = http.createServer(app); 
const io = socketIO(server); 


mongoose.connect('mongodb+srv://mbabazieken:kashera2023@cluster0.x3cma6f.mongodb.net/daystar');
console.log('mongodb connected')

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'trwearbombekueasnoloba',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// WebRTC signaling via Socket.io
io.on('connection', socket => {
    console.log('A user connected');
    
    //  offer from caller
    socket.on('offer', (data) => {
        socket.broadcast.emit('offer', data);
    });

    //  answer from callee
    socket.on('answer', (data) => {
        socket.broadcast.emit('answer', data);
    });

    //  ICE candidates
    socket.on('ice-candidate', (data) => {
        socket.broadcast.emit('ice-candidate', data);
    });
});


app.listen(8800, () => {
    console.log('Server is running on port 8800');
});
