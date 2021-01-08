const { MessageEmbed } = require("discord.js");

module.exports = {
  run: async (client, message, args) => {
    let toSend = args.splice(1); //channel
    let send = args.join(" "); //message to send
    let { id } = await message.guild.channels.cache.find(
      (channel) => channel.name === send
    );
    toChannel = message.guild.channels.cache.get(id);
    if (toChannel) {
      let emb = new MessageEmbed()
      .setTitle("Role Reaction Menu")
      .setDescription(toSend)
      .setColor(0xff0000)
      toChannel.send(emb);
    } else {
      toChannel.send(`${send} is not a valid channel.`);
    }
  },
  alias: ["say", "post", "ann", "a"],
  description: "Announce a message to another channel.",
};
