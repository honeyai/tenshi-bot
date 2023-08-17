//=========================================================
//Adding reactions to the initialized role-reaction message
//=========================================================
//! on-going issue. When bot restarts, it doesn't trigger old command event (will forget about the initialized message)

const { MessageModel, cachedReactions } = require("../../tenshi");

module.exports = {
  run: async (client, reaction, user) => {
    let { id } = reaction.message;
    const addRole = (role) => {
      if (role) {
        let roleName = reaction.message.guild.roles.cache.get(role); //finds the role's name
        let member = reaction.message.guild.members.cache.get(user.id);
        //if the role exists in the server add it to the user who reacted
        if (roleName && member) {
          member.roles
            .add(roleName)
            .then((member) =>
              reaction.message.channel.send(
                `You were added to ${roleName.name}.`
              )
            )
            .catch((error) => {
              console.error(error);
              reaction.message.channel.send("Something went wrong...");
            });
        } else {
          console.log("Role doesn't exist"); //Likely wouldn't happen because there were checks before initialization of the role reaction message.
        }
      }
    };
    try {
      let cachedEmojiRole;
      let msgDoc = await MessageModel.findOne({ messageId: id });
      if (msgDoc) {
        //is it cached, just add it
        if (cachedReactions.has(id)) {
          console.log("Was already cached");
          cachedEmojiRole = cachedReactions.get(id); //retrieves the role id
          addRole(cachedEmojiRole);
        }
        //otherwise cache it then add
        else {
          let role = msgDoc.emojiRole[reaction.emoji.id];
          cachedReactions.set(id, role);
          addRole(role);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
  description: "Adding reactions to the initialized role-reaction message",
};
