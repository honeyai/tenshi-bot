const { MessageCollector } = require("discord.js");

let messageFilter = async (message, original) => {
  let [emojiName, roleName] = original.content.toLowerCase().split(/,\s+/);
  let { cache } = message.guild.roles;
  //making sure that another message doesn't interfere
  let isSameAuthor = message.author.id === original.author.id ? true : false;
  if (!original.author.bot) {
    //making sure that the message follows the right model
    if (!emojiName && !roleName && !message.author.bot) {
      message.channel.send(
        "Please follow this structure 'emoji name, role name' for correct set up."
      );
      return false; //don't collect this message
    } else {
      if (cache.find((role) => role.name === roleName)) {
        if (isSameAuthor) {
          message.channel.send(
            `You may enter the next role.`
          );
          return true;
        }
      } else {
        message.channel.send(`The role, ${roleName}, doesn't exist.\nPlease create this role and try again.`)
      }
    }
  }
};

module.exports = {
  run: async (client, message, args) => {
    console.log(args);
    if (args.length !== 1) {
      let msg = await message.channel.send(
        "Please only send one message ID to initialize."
      );
      await msg.delete({ timeout: 5000 }).catch((error) => console.log(error));
    } else {
      try {
        let collector = new MessageCollector(
          message.channel,
          messageFilter.bind(null, message) //first null because function isn't being bound to an object, and message is any additional params
        );
        let fetched = await message.channel.messages.fetch(args[0]);
        if (fetched) {
          message.channel.send(
            "Provide emoji name and the role. \nex. amongus, imposter \nSend each pair in a new message."
          );
          collector.on("collect", (msg) => {
            console.log(`${msg.content} was collected`);
          });
        }
      } catch (error) {
        console.log(error);
        let msg = await message.channel.send("Message doesn't exist.");
        await msg
          .delete({ timeout: 5000 })
          .catch((error) => console.error(error));
      }
    }
  },
  alias: ["rolestart", "init"],
  description: "Creates a message with reactions.",
};
