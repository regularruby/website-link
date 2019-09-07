const facebook = require('facebook-chat-api')
const Discord = require('discord.js');
const client = new Discord.Client();
const login = require("./login.json")

const colors = require('colors');
const fs = require('fs');

const express = require('express')
const app = express();
const server = require('http').createServer(app)
const io = require('socket.io').listen(server)

var users = [];
var connections = [];


//opens html
server.listen(process.env.PORT || 3000);
console.log('server running...')

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log('connected: %s sockets connected', connections.length)


    socket.on('disconnect', data => {
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        connections.splice(connections.indexOf(socket), 1);
        console.log("disconnected: %s sockets connected", connections.length)
    })

    socket.on('send message', (data, user) => {
        io.sockets.emit('new message', {msg: data, sender: user})
    })

    socket.on('new user', (data, callback) => {
        callback(true);
        socket.username = data;
        users.push(socket.username)
        updateUsernames();
    })

    function updateUsernames(){
        io.sockets.emit('get users', users)
    }
})

function discord() {
    client.login(json.login.discord_bot.client_token);

    client.on("ready", () => {
        delete require.cache[require.resolve('./events/ready.js')]
        require('./events/ready.js')(client, "discord")
    });

    client.on("message", msg => {

    });
}

function messenger() {
    messenger({
        email: `${login.messenger.email}`,
        password: `${login.messenger.password}`
    }, (err, fb) => {
        if (err) return console.error(err);
        fb.setOptions({
            logLevel: "silent"
        })
        fb.listen((err, message) => {
            if (err) return console.error(err);
            fb.getUserInfo([message.senderID], (err, userinfo) => {
                if (err) return console.error(err);
                require(`./events/messenger_message.js`)(fb, message, userinfo)
            });
        });
    });
}