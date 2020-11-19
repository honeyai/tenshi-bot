const discord = require("discord.js");
const client = new discord.Client();
const token = require("../../envDoesntWork.json").BOT_TOKEN;
const PREFIX = require("../../envDoesntWork.json").PREFIX;

client.login(token);

client.on("ready", () => {
  console.log("Tenshi has descended from the heavens and has logged in.");
});

const validateCommand = (message, command) =>
  message.content.toLowerCase().startsWith(PREFIX + command);
const rollDice = () => Math.floor(Math.random() * 6) + 1;
const checkRolePermissions = (role) =>
  role.permissions.has("ADMINISTRATOR") ||
  role.permissions.has("KICK_MEMBERS") ||
  role.permissions.has("BAN_MEMBERS") ||
  role.permissions.has("MANAGE_CHANNELS") ||
  role.permissions.has("MANAGE_GUILD");

client.on("message", (message) => {
  if (message.author.bot) return;

  /*----------  Hello  ----------*/
  if (validateCommand(message, "hello")) message.reply("hello");

  /*----------  Dice Roller  ----------*/
  if (validateCommand(message, "rolldice"))
    message.reply("rolled a " + rollDice());

  /*----------  Adding Roles  ----------*/
  if (validateCommand(message, "add")) {
    let [command, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    let roleSet = new Set(args);
    let { cache } = message.guild.roles;

    roleSet.forEach((roleName) => {
      let roleTag = cache.find((role) => role.name.toLowerCase() === roleName);
      if (roleTag) {
        if (message.member.roles.cache.has(roleTag.id)) {
          message.channel.send("You have this role already.");
          return;
        }
        if (checkRolePermissions(roleTag)) {
          message.channel.send(`You cannot add yourself to ${roleTag.name}.`);
        } else {
          message.member.roles
            .add(roleTag)
            .then((member) =>
              message.channel.send(`You were added to ${roleTag.name}.`)
            )
            .catch((error) => {
              console.error(error);
              message.channel.send("Something went wrong...");
            });
        }
      } else {
        message.channel.send("Role not found!");
      }
    });
  }

  /*----------  Removing a Role  ----------*/
  if (validateCommand(message, "remove")) {
    let [command, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);
    let roleSet = new Set(args);
    let { cache } = message.guild.roles;

    roleSet.forEach((roleName) => {
      let roleTag = cache.find((role) => role.name.toLowerCase() === roleName);
      if (roleTag) {
        if (message.member.roles.cache.has(roleTag.id)) {
          message.member.roles
            .remove(roleTag)
            .then((member) =>
              message.channel.send(
                `You were removed from ${roleTag.name}.`
              )
            )
            .catch((error) => {
              console.error(error);
              message.channel.send("Something went wrong...");
            });
        } else if (!message.member.roles.cache.has(roleTag.id)) {
          message.channel.send("You don't have this role to remove.");
        }
      } else {
        message.channel.send("Role not found!");
      }
    });
  }

  
  /*----------  Sending a Message in Another Channel  ----------*/
  if (validateCommand(message, "announce")){
    let [command, send, ...announce] = message.content.trim().substring(PREFIX.length).split(/\s+/);
    let toSend = announce.join(" ");
    //trying to find the of a channel through name
    let channel = client.channels.cache.find(channel => channel.name.toLowerCase() === send);
    console.log(channel);
    if (channel) {
      channel.send(toSend);
    } else {
      message.channel.send(`${send} is not a valid channel.`);
    }
  }
});
