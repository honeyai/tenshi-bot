//The entry point to the bot

//importing env variable => loads up all the env variables
//! if os has an env with the same name it will interpret variable with os' variable of the same name

const botToken = require("../envDoesntWork.json").BOT_TOKEN;

//to interact with the discord api
const { Client } = require("discord.js");
const client = new Client();
//* == NOTE ==
//Client is a subclass of EventEmitter (extends EventEmitter) => Client extends BaseClient extends EventEmitter
// - EventEmitter from node: defined and exposed by events module

//responding to actions taken in discord, ie. delete a message, sending a message, reactions

//registering an event
client.on("ready", () => {
  console.log(`${client.user.username}, ${client.user.tag} has logged in`);
});

client.on("message", (message) => {
  console.log(message.author.tag, "sent a message:", message.content);
  if (message.content === "hello") {
    message.reply("hello there!");
  }
  if (
    message.content.toLocaleLowerCase() === "fuck you" ||
    message.author.tag === "guardian_angel#0205"
  ) {
    let tenshiSayings = [
      "Sorry I don't speak, pleb.",
      "Get back to work.",
      "Don't you have anything better to do?",
      "This is embarrassing... but, I don't care.",
      "Creator, you have broken my heart",
    ];
    let randomPhrase = Math.floor(Math.random() * tenshiSayings.length);
    message.channel.send(randomPhrase);
  }
});

//takes in the bot token to get the bot online
client.login(botToken);

// console.log(botToken, "i would've shown up");
