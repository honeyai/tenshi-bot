//============================
//Listen for reaction removed
//============================

const { MessageModel, cachedReactions } = require("../../tenshi"); 

module.exports = {
  run: async (client, reaction, user) => {
    //when reaction is removed, that emoji id is linked to a role. Get that role and remove it from the user.
    //getting the role of the emoji that was removed
    let roleId = await cachedReactions.get(reaction.message.id);
    console.log("this is the message id", reaction.message.id);
    console.log("this is the cache:", cachedReactions);
    console.log("This is roleID:", roleId);
    let role = reaction.message.guild.roles.cache.get(roleId);
    let member = reaction.message.guild.members.cache.get(user.id);
    
    if (member.roles.cache.has(roleId)) {
      member.roles
        .remove(role)
        .then((member) =>
          reaction.message.channel.send(`You were removed from ${role.name}.`)
        )
        .catch((error) => {
          console.error(error);
          reaction.message.channel.send("Something went wrong...");
        });
    } else {
      reaction.message.channel.send("something went wrong");
    }
  },
  description: "Listen for reaction removed and remove associated role"
}