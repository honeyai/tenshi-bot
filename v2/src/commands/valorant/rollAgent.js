const { MessageEmbed } = require("discord.js");
const { agents } = require("../../tenshi.js");

module.exports = {
  run: async (client, message, args) => {
    let length = agents.length;
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
        let selectedAgent = agents[rNum];
        //designing embedded msg to look fa
        let emb = new MessageEmbed()
          .setTitle(selectedAgent.name)
          .setColor(selectedAgent.color)
          .setImage(selectedAgent.image)
        message.reply(`you will be playing ${selectedAgent.name}.`);
        message.channel.send(emb);
      } catch (e) {
        console.error(e);
      }
    }
  },
  alias: ["rollA", "agent"],
  description: "Roll for your Agent."
}