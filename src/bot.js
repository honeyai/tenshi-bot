/*=============================================
=      Irrelevant but helpful info            =
=============================================*/

//importing env variable => loads up all the env variables
//! if os has an env with the same name it will interpret variable with os' variable of the same name

/*=====  End of Irrelevant but helpful info  ======*/

//* == NOTE ==
//Client is a subclass of EventEmitter (extends EventEmitter) => Client extends BaseClient extends EventEmitter
// - EventEmitter from node: defined and exposed by events module
//* ===========

/*----------  The entry point to the bot  ----------*/

const botToken = require("../envDoesntWork.json").BOT_TOKEN;
const webhookToken = require("../envDoesntWork.json").WEBHOOK_TOKEN;
const webhookId = require("../envDoesntWork.json").WEBHOOK_ID;

const command = require("./commands");
const PREFIX = require("../envDoesntWork.json").PREFIX;

//to interact with the discord api
const { Client, WebhookClient, DiscordAPIError } = require("discord.js");
const client = new Client({
  partials: ["MESSAGE", "REACTION"],
});

client.on("ready", () => {
  console.log(`${client.user.username}, ${client.user.tag} has logged in`);

  command(client, "ping", (message) => {
    message.channel.send("Pong!");
  });

  command(client, ["help", "h"], (message) => {
    message.reply(
      ` I can tell you my command prefix and tell you your roles.
      $p or $prefix will list the command prefix.
      $r or $roles will list all your assigned roles.
      `
    );
  });

  command(client, ["prefix", "p"], (message) => {
    message.reply(`My prefix is: ${PREFIX}`)
  })

  command(client, ["roles", "r"], (message) => {
    let roles = message.member.roles.cache
      .map((role) => {
        return role.name;
      })
      .join(", ");

    message.reply(`here are your roles: ${roles}.`);
  });

  command(client, "shh", (message) => {
    message.channel.send(emoji("774379818434297858"));
  });


  //===== Making the react channel =====
  // command(client, "reactions", async (message) => {
  //   let embedded = new Discord.MessageEmbed()
  //   .setTitle(`Reaction Roles`)
  //   .setDescription(`React to get roles`)
  //   .setColor('GREEN') //might be optional
  //   let embdMsg = await message.channel.send(embedded)
  //   .embdMsg.react(:Amongus:)
  // });
});

//takes in the bot token to get the bot online
client.login(botToken);

//Making custom emoji roles
const emoji = id => client.emojis.cache.get(id).toString();
