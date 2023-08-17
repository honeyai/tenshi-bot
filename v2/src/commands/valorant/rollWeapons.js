const { MessageEmbed, Message } = require("discord.js");
const { primary, secondary } = require("../../tenshi.js");

module.exports = {
  run: async (client, message, args) => {
    let plength = primary.length;
    let slength = secondary.length;
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
        let rPrimary = Math.floor(Math.random() * plength);
        let rSecondary = Math.floor(Math.random() * slength);
        let selectedP = primary[rPrimary];
        let selectedS = secondary[rSecondary];
        //designing embedded msg to look fa
        let embP = new MessageEmbed()
          .setTitle(selectedP.name)
          .setImage(selectedP.image)
        let embS = new MessageEmbed()
          .setTitle(selectedS.name)
          .setImage(selectedS.image)  
        message.reply(`you will be using a ${selectedP.name} and a ${selectedS.name}.`);
        message.channel.send(embP);
        message.channel.send(embS);
      } catch (e) {
        console.error(e);
      }
    }
  },
  alias: ["rollW", "weapon", "weapons", "rollw", "rollweapons"],
  description: "Roll for your primary and secondary weapons."
}