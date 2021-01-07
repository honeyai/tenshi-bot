const fs = require("fs").promises;
const path = require("path");
const c = require("ansi-colors");
const discord = require("discord.js");

const client = new discord.Client({ partials: ["MESSAGE", "REACTION"] });
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

client.on("messageReactionAdd", async (reaction, user) => {
  if(reaction.message.partial) {
    console.log("Message is a partial");
  } else {
    console.log("Message is not a partial", reaction.message.partial.id);
  }
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  let [command, ...args] = message.content
    .toLowerCase()
    .trim()
    .substring(PREFIX.length)
    .split(/\s+/);

  if (client.commands.get(command)) {
    client.commands.get(command)(client, message, args);
  } else {
    console.log("Command doesn't exist");
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
