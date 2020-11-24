const { MessageCollector } = require("discord.js");
const MessageModel = require("../../database/models/message.js");

let messageFilter = async (message, original) => {
  if (
    original.content
      .toLowerCase()
      .split(/,\s+/)
      .includes("exit", "done", "finished")
  ) {
    console.log(original.content)
    console.log("I heard you");
  } else {
    console.log("I'm ignoring the condition")
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
            message.channel.send(
              `You may enter the next role. Or send "exit", "done", or "finished" to complete initialization.`
            );
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
  }
};

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
            //breaking out of the ask
            if (
              msg.content
                .toLowerCase()
                .split(/,\s+/)
                .includes("exit", "done", "finished")
            ) {
              console.log("I've spotted the words but oh well")
              collector.stop("Reactions initialized.");
              return;
            }
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
              fetched
                .react(emojiFind)
                .then((emoji) => console.log("reacted with " + emojiFind + "."))
                .catch((error) => console.error(error));
              emojiRoleMap.set(emojiFind, roleFind);
              // let stored = new MessageModel({
              //   messageId: fetched,
              //   emojiRole: { "`${emojiFind}`": roleFind },
              // })
              //   .save()
              //   .then((saved) => console.log(saved))
              //   .catch((error) => console.error(error));
            }
          });
          collector.on("end", (collected, reason) => {
            console.log(emojiRoleMap);
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
