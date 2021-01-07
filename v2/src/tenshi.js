const fs = require("fs").promises;
const path = require("path");
const c = require("ansi-colors");
const discord = require("discord.js");

const client = new discord.Client({ partials: ["MESSAGE", "REACTION"] }); //! might not need the partials
const { checkModule, checkProp } = require("./utils/validate.js");
const { createStream, table } = require("table");

const token = require("../../envDoesntWork.json").BOT_TOKEN;
const PREFIX = require("../../envDoesntWork.json").PREFIX;
const tableConfig = require("./utils/tableConfig");
const db = require("./database/database.js");
const MessageModel = require("./database/models/message.js");
const { find } = require("./database/models/message.js");
const commandStatus = [
  [`${c.blueBright.bold("Command")}`, `${c.blueBright.bold("Status")}`],
];

const cachedReactions = new Map();

client.login(token);
client.commands = new Map();

//================================================
//For the terminal visualization of command status
//================================================
client.on("ready", () => {
  let stream = createStream(tableConfig);
  let i = 0;
  let fn = setInterval(() => {
    if (i === commandStatus.length) clearInterval(fn);
    else {
      stream.write(commandStatus[i]);
      i++;
    }
  }, 200);
  console.log("Tenshi has descended from the heavens and has logged in.");
  db.then(() => console.log("Connected to mongo.")).catch((error) =>
    console.error(error)
  );
});

//=========================================================
//Adding reactions to the initialized role-reaction message
//=========================================================
//! on-going issue. When bot restarts, it doesn't trigger old command event (will forget about the initialized message)
client.on("messageReactionAdd", async (reaction, user) => {
  let { id } = reaction.message;
  try {
    let msgDoc = await MessageModel.findOne({ messageId: id });
    if (msgDoc) {
      //is it cached?
      if (cachedReactions.has(id)) {
        let cachedEmojiRole = cachedReactions.get(id);
      }
      //otherwise cache it
      else cachedReactions.set(id, msgDoc.emojiRole);
      if (msgDoc.emojiRole.hasOwnProperty(reaction.emoji.id)) {
        let roleId = msgDoc.emojiRole[reaction.emoji.id];
        let role = reaction.message.guild.roles.cache.get(roleId);
        let member = reaction.message.guild.members.cache.get(user.id);
        //if the role exists in the server add it to the user who reacted
        if (role && member) {
          member.roles
            .add(role)
            .then((member) =>
              reaction.message.channel.send(`You were added to ${role.name}.`)
            )
            .catch((error) => {
              console.error(error);
              reaction.message.channel.send("Something went wrong...");
            });
        } else {
          console.log("Role doesn't exist"); //Likely wouldn't happen because there were checks before initialization of the role reaction message.
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

//============================
//Listen for reaction removed
//============================
client.on("messageReactionRemove", async (reaction, user) => {
  //when reaction is removed, that emoji id is linked to a role. Get that role and remove it from the user.
  //getting the id of the message that was removed
  let { id } = reaction.message;
  let msgDoc = await MessageModel.findOne({ messageId: id });
  let member = reaction.message.guild.members.cache.get(user.id);
  let roleId = msgDoc.emojiRole[reaction.emoji.id];
  let role = reaction.message.guild.roles.cache.get(roleId);
  if (member.roles.cache.has(role)) {
    remember.roles
      .remove(role)
      .then((member) =>
        message.channel.send(`You were removed from ${roleTag.name}.`)
      )
      .catch((error) => {
        console.error(error);
        message.channel.send("Something went wrong...");
      });
  }
});

//=======================================================
//Listens for the command keyword with the correct prefix
//=======================================================
client.on("message", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return; //*might want to inform that this is the incorrect prefix

  let [command, ...args] = message.content
    .toLowerCase()
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);

  if (client.commands.get(command)) {
    console.log("these are the args:", args)
    client.commands.get(command)(client, message, args);
  } else {
    console.log("Command doesn't exist", command);
  }
});

//===================================================================
//Registering filenames as command keyword and allowing for aliases
//===================================================================
(commandRegister = async (dir = "commands") => {
  let files = await fs.readdir(path.join(__dirname, dir));
  // console.log(files);

  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory()) commandRegister(path.join(dir, file));
    else {
      if (file.endsWith(".js")) {
        let cmdName = file.substring(0, file.indexOf(".js"));
        try {
          let cmdModule = require(path.join(__dirname, dir, file));
          if (checkModule(cmdName, cmdModule)) {
            if (checkProp(cmdName, cmdModule)) {
              let { alias } = cmdModule;
              client.commands.set(cmdName, cmdModule.run);
              if (alias.length !== 0) {
                alias.forEach((alias) =>
                  client.commands.set(alias, cmdModule.run)
                );
                commandStatus.push([
                  `${c.yellow(`${cmdName}`)}`,
                  `${c.black.bgCyan.dim("Success")}`,
                ]);
              }
            }
          }
        } catch (error) {
          console.error(error);
          commandStatus.push([
            `${c.red(`${cmdName}`)}`,
            `${c.red.bgYellowBright("Failed")}`,
          ]);
        }
      }
    }
  }
})();
