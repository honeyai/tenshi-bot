
/*=============================================
=      Irrelevant but helpful info            =
=============================================*/

//importing env variable => loads up all the env variables
//! if os has an env with the same name it will interpret variable with os' variable of the same name

/*=====  End of Irrelevant but helpful info  ======*/



/*----------  The entry point to the bot  ----------*/

const botToken = require("../envDoesntWork.json").BOT_TOKEN;
const webhookToken = require("../envDoesntWork.json").WEBHOOK_TOKEN;
const webhookId = require("../envDoesntWork.json").WEBHOOK_ID;
//* == NOTE ==
//Client is a subclass of EventEmitter (extends EventEmitter) => Client extends BaseClient extends EventEmitter
// - EventEmitter from node: defined and exposed by events module
//* ===========

//to interact with the discord api
const { Client, WebhookClient } = require("discord.js");
const client = new Client({
  partials: ['MESSAGE', 'REACTION']
});

client.on("ready", () => {
  console.log(`${client.user.username}, ${client.user.tag} has logged in`);
});

//takes in the bot token to get the bot online
client.login(botToken);





