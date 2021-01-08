const fs = require("fs").promises;
const path = require("path");
const c = require("ansi-colors");
const discord = require("discord.js");

const client = new discord.Client({ partials: ["MESSAGE", "REACTION"] }); //! might not need the partials
const {
  checkModule,
  checkProp,
  checkEventModule,
  checkEventProp,
} = require("./utils/validate.js");

const token = require("../../envDoesntWork.json").BOT_TOKEN;
const MessageModel = require("./database/models/message.js");

const commandStatus = [
  [`${c.blueBright.bold("Command")}`, `${c.blueBright.bold("Status")}`],
];

const cachedReactions = new Map();

module.exports = {
  MessageModel,
  cachedReactions,
  commandStatus
}; 

client
  .login(token)
  .catch(console.error);
client.commands = new Map();

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

//===================================================================
//Registering filenames as events and allowing for aliases
//===================================================================
(eventRegister = async (dir = "events") => {
  let files = await fs.readdir(path.join(__dirname, dir));

  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory()) eventRegister(path.join(dir, file));
    else {
      if (file.endsWith(".js")) {
        let eventName = file.substring(0, file.indexOf(".js"));
        try {
          let eventModule = require(path.join(__dirname, dir, file));
          client.on(eventName, eventModule.run.bind(null, client));
          if (checkEventModule(eventName, eventModule)) {
            if (checkEventProp(eventName, eventModule)) {
              client.commands.set(eventName, eventModule.run);
              commandStatus.push([
                `${c.yellow(`${eventName}`)}`,
                `${c.black.bgCyan.dim("Success")}`,
              ]);
            }
          }
        } catch (error) {
          console.error(error);
          commandStatus.push([
            `${c.red(`${eventName}`)}`,
            `${c.red.bgYellowBright("Failed")}`,
          ]);
        }
      }
    }
  }
})();
