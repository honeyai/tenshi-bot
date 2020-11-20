const { MessageCollector } = require("discord.js");

let messageFilter = (message, original) => {
  
  message.author.id === original.author.id ? true : false;
}

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
        let fetched = await message.channel.messages.fetch(args);
        if (fetched) {
          message.channel.send("Provide emoji name and the role.")
          let collector = new MessageCollector(
            message.channel,
            messageFilter.bind(null, message) //first null because function isn't being bound to an object, and message is any additional params
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
