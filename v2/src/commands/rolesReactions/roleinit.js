const { MessageCollector } = require("discord.js");

let messageFilter = async (message, original) => {
  let [emojiName, roleName] = original.content.toLowerCase().split(/,\s+/);
  let roleFind = message.guild.roles.cache.find(
    (role) => role.name === roleName
  );
  let emojiFind = message.guild.emojis.cache.find(
    (emoji) => emoji.name === emojiName
  );
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
      if (roleFind && emojiFind) {
        if (isSameAuthor) {
          message.channel.send(`You may enter the next role.`);
          return true;
        }
      } else {
        if (!roleFind) {
          message.channel
            .send(
              `The role, ${roleName}, doesn't exist.\nPlease create this role and try again.`
            )
            .then((msg) => msg.delete({ timeout: 3000 }))
            .catch((error) => console.error);
        } else {
          message.channel
            .send(
              `The emoji, ${emojiName}, doesn't exist.\nPlease create this emoji or type in the correct emoji name and try again.`
            )
            .then((msg) => msg.delete({ timeout: 3000 }))
            .catch((error) => console.error);
        }
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
            //all the messages that passed the filter will have to be parsed again.
            let [emojiName, roleName] = msg.content.toLowerCase().split(/,\s+/);
            let roleFind = msg.guild.roles.cache.find(
              (role) => role.name === roleName
            );
            let emojiFind = msg.guild.emojis.cache.find(
              (emoji) => emoji.name === emojiName
            );
            if (emojiFind && roleFind) {
              //save to database
              fetched.react(emojiFind).then(emoji => console.log("reacted with" + emoji + ".")).catch(error => console.error(error));
            }
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
