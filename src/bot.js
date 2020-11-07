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
const { Client, WebhookClient } = require("discord.js");
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
    message.reply(`My prefix is: ${PREFIX}`);
  });

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

  command(client, "ban", async (message) => {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (!message.member.hasPermission("BAN_MEMBERS"))
      return message.reply("You don't have permissions to kick users.");
    if (args.length === 0) return message.reply("Please provide a user");

    try {
      const user = await message.guild.members.ban(args[0]); //gives a user resolvable => user object, snowflake(id),
      //message, GuildMember
      message.channel.send("User was banned successfully.");
    } catch (error) {
      message.channel.send(
        `I couldn't do that. Either I don't have permissions or that user doesn't exists.`
      );
    }
  });

  command(client, "kick", (message) => {
    const [CMD_NAME, ...args] = message.content
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    if (!message.member.hasPermission("KICK_MEMBERS"))
      return message.reply("You don't have permissions to kick users.");
    if (args.length === 0) return message.reply("Please provide a user");
    const member = message.guild.members.cache.get(args[0]);
    if (member) {
      member
        .kick()
        .then((member) => message.channel.send(member, "was kicked."))
        .catch((error) => message.channel.send("I can't kick ", member));
    } else {
      message.channel.send(`That member was not found`);
    }
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
const emoji = (id) => client.emojis.cache.get(id).toString();
