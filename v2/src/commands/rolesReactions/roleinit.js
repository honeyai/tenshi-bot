const { MessageCollector } = require("discord.js");
const MessageModel = require("../../database/models/message.js");

let messageFilter = async (message, original) =>
  message.author.id === original.author.id && !original.author.bot;

module.exports = {
  run: async (client, message, args) => {
    // console.log(args);
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
          let emojiRoleMap = new Map();
          collector.on("collect", (msg) => {
            if (msg.content.toLowerCase() === "done") {
              collector.stop("No longer waiting for roles.");
              return;
            }
            //all the messages that passed the filter will have to be parsed again.
            let [emojiName, roleName] = msg.content.toLowerCase().split(/,\s+/);
            let roleFind = msg.guild.roles.cache.find(
              (role) => role.name === roleName
            );
            let emojiFind = msg.guild.emojis.cache.find(
              (emoji) => emoji.name === emojiName
            );
            if (!emojiName || !roleName)
              message.channel.send(
                `Please send your message as a pair separated with a coma. \nex. amongus, imposter.`
              );
            else if (emojiFind && roleFind) {
              message.channel.send(
                `You may enter the next role. Or send "done" to complete initialization.`
              );
              fetched
                .react(emojiFind)
                .then((emoji) => console.log("reacted with " + emojiFind + "."))
                .catch((error) => console.error(error));
              emojiRoleMap.set(emojiFind.id, roleFind.id);
            } else if (!roleFind) {
              message.channel
                .send(
                  `The role, ${roleName}, doesn't exist.\nPlease create this role and try again.`
                )
                .then((msg) => msg.delete({ timeout: 3000 }))
                .catch((error) => console.error(error));
            } else if (!emojiFind) {
              message.channel
                .send(
                  `The emoji, ${emojiName}, doesn't exist.\nPlease create this emoji or type in the correct emoji name and try again.`
                )
                .then((msg) => msg.delete({ timeout: 3000 }))
                .catch((error) => console.error(error));
            }
          });
          collector.on("end", async (collected, reason) => {
            console.log("Done collecting", emojiRoleMap);
            let findDoc = await MessageModel.findOne({
              messageId: fetched.id,
            }).catch(error => console.error(error));
            if (findDoc) {
              console.log("This message exists. Not saved.");
              message.channel.send("You're trying to initialize a message that's already set up.");
            } else {
              let msgModel = new MessageModel({
                messageId: fetched.id,
                emojiRole: emojiRoleMap,
              });
              msgModel
                .save()
                .then() //(something) => console.log(something)
                .catch((error) => console.error(error));
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
