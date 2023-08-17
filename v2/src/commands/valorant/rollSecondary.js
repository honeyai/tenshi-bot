const { MessageEmbed } = require("discord.js");
const { secondary } = require("../../tenshi.js");

module.exports = {
  run: async (client, message, args) => {
    let length = secondary.length;
    const rouletteChannel = message.channel.id === "963273916552470548";
    if (!rouletteChannel) {
      try {
        await message.reply(
          "All Roulette commands should be sent to #roulette!"
        );
      } catch (e) {
        console.error(e);
      }
    } else {
      try {
        message.channel.send("The wheel is spinning...");
        let rNum = Math.floor(Math.random() * length);
        let selectedSecondary = secondary[rNum];
        //designing embedded msg to look fa
        let emb = new MessageEmbed()
          .setTitle(selectedSecondary.name)
          .setImage(selectedSecondary.image)
        message.reply(`you will be using a`);
        message.channel.send(emb);
      } catch (e) {
        console.error(e);
      }
    }
  },
  alias: ["rollS", "secondary"],
  description: "Roll for your secondary weapon."
}