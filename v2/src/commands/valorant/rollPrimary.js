const { MessageEmbed } = require("discord.js");
const { primary } = require("../../tenshi.js");

module.exports = {
  run: async (client, message, args) => {
    let length = primary.length;
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
        let selectedPrimary = primary[rNum];
        //designing embedded msg to look fa
        let emb = new MessageEmbed()
          .setTitle(selectedPrimary.name)
          .setImage(selectedPrimary.image)
        message.reply(`you will be using a`);
        message.channel.send(emb);
      } catch (e) {
        console.error(e);
      }
    }
  },
  alias: ["rollP", "primary"],
  description: "Roll for your primary weapon."
}