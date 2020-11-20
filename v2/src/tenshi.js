const fs = require("fs").promises;
const path = require("path");

const discord = require("discord.js");
const client = new discord.Client();
const token = require("../../envDoesntWork.json").BOT_TOKEN;
const PREFIX = require("../../envDoesntWork.json").PREFIX;

client.login(token);
client.commands = new Map();
client.on("ready", () => {
  console.log("Tenshi has descended from the heavens and has logged in.");
});

client.on("message", (message) => {
  if (message.author.bot) return;
  if(!message.content.startsWith(PREFIX)) return;

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

(commandRegister = async (dir = "commands") => {
  let files = await fs.readdir(path.join(__dirname, dir));
  // console.log(files);

  for (let file of files) {
    let stat = await fs.lstat(path.join(__dirname, dir, file));
    if (stat.isDirectory()) commandRegister(path.join(dir, file));
    else {
      if (file.endsWith(".js")) {
        let cmdName = file.substring(0, file.indexOf(".js"));
        let cmdModule = require(path.join(__dirname, dir, file));
        let { alias } = cmdModule;
        client.commands.set(cmdName, cmdModule.run);
        if(alias.length !== 0) {
          alias.forEach(alias => client.commands.set(alias, cmdModule.run));
        }
        // console.log(client.commands);
      }
    }
  }
})();
