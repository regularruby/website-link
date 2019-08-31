const facebook = require('facebook-chat-api')
const Discord = require('discord.js');
const colors = require('colors');
const fs = require('fs');
const client = new Discord.Client();
const login = require("./login.json")


client.login(json.login.discord_bot.client_token);

client.on("ready", () => {
    
});

client.on("message", msg => {

});

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