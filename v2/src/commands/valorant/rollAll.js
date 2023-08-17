const { MessageEmbed } = require("discord.js");
const { agents } = require("../../tenshi.js");
const { primary } = require("../../tenshi.js");
const { secondary } = require("../../tenshi.js");

module.exports = {
  run: async (client, message, args) => {
    let aLength = agents.length;
    let pLength = primary.length;
    let sLength = secondary.length;

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
        let aNum = Math.floor(Math.random() * aLength);
        let pNum = Math.floor(Math.random() * pLength);
        let sNum = Math.floor(Math.random() * sLength);
        let selectedAgent = agents[aNum];
        let selectedPrimary = primary[pNum];
        let selectedSecondary = secondary[sNum];
        let embeds = [];
        let agentM = new MessageEmbed()
          .setTitle(selectedAgent.name)
          .setColor(selectedAgent.color)
          .setImage(selectedAgent.image);
        let primaryM = new MessageEmbed()
          .setTitle(selectedPrimary.name)
          .setImage(selectedPrimary.image);
        let secondaryM = new MessageEmbed()
          .setTitle(selectedSecondary.name)
          .setImage(selectedSecondary.image);
        message.reply(`you've been given`);
        message.channel.send(agentM);
        message.channel.send(primaryM);
        message.channel.send(secondaryM);
      } catch (e) {
        console.error(e);
      }
    }
  },
  alias: ["all"],
  description: "Roll for your all roulette options."
}