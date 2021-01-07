//=======================================================
//Listens for the command keyword with the correct prefix
//=======================================================
const PREFIX = require("../../../../envDoesntWork.json").PREFIX;

module.exports = {
  run: (client, message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return; //*might want to inform that this is the incorrect prefix

    let [command, ...args] = message.content
      .toLowerCase()
      .trim()
      .substring(PREFIX.length)
      .split(/\s+/);

    if (client.commands.get(command)) {
      console.log("these are the args:", args);
      client.commands.get(command)(client, message, args);
    } else {
      console.log("Command doesn't exist", command);
    }
  },
  description: "Listens for the command keyword with the correct prefix",
};
